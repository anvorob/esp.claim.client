import React,{Component} from 'react';
import './App.css';
import './Dialog.css';
import $ from 'jquery'; 
import Tile from "./Tile"
import Dialog from "./Dialog"
import ClaimForm from './ClaimForm'
import './bootstrap1.css';


class App extends Component 
{
  constructor()
  {
      super()
      this.state={
          modalIsOpen:false,
          workers:{
            selectedID:0,
            active:true,
            data:[]
          },
          workTypes:{
            selectedID:0,
            active:false,
            data:[]
          },
          jobs:{
            selectedID:0,
            active:false,
            data:[]
          }
      }
      this.handleChange = this.handleChange.bind(this)  
      this.getTaskTypes = this.getTaskTypes.bind(this)  
      this.getJobsForTaskType = this.getJobsForTaskType.bind(this)  
      
  }

  getTaskTypes(workerID) {
    $.ajax({
        type: "GET",
        url: "http://localhost:52098/api/TaskType?oid="+workerID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //data: "{ workerId: " + WorkerId + "}",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Error occured when log out validation was attempted.");
        },
        success: function (result) {
          // resetting workers state
          this.setState(prevState=>{
                      return{
                        workers:{
                          data:prevState.workers.data,
                          active:false,
                          selectedID:workerID
                        }
                      }
                    }
                  )
          //resetting jobs
          this.setState(prevState=>{
                    return{
                      jobs:{
                        data:[],
                        active:false
                      }
                    }
                  }
                )
          this.setState({workTypes:{data:result,active:true}});
      }.bind(this)
    });
  }

  getJobsForTaskType(workTypeCode) {
    $.ajax({
        type: "GET",
        url: "http://localhost:52098/api/Task/" + workTypeCode,
        //url: "../UP.WorkersTileList.aspx/LogininDuringLeave",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //data: "{ workerId: " + WorkerId + "}",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Error occured when log out validation was attempted.");
  
        },
        success: function (result) {
          
        this.setState(prevState=>{
            return{
              workTypes:{
                data:prevState.workTypes.data,
                active:false,
                selectedID:workTypeCode
              }
            }
          }
        )
          this.setState({jobs:{data:result,active:true}});
      }.bind(this)
    });
  }
  handleChange(event)
  {
    const {name,value,type,className,key} = event.target
    const dataType = event.target.getAttribute("data-Type");
    const dataID = event.target.getAttribute("data-id");
    // Trigger this if worker tile clicked
    if(dataType=="worker" && dataID!==""){
      this.getTaskTypes(dataID)
      this.setState(prevState=>{
        return {
          worker:{
            data:prevState.workers.data,
            active:prevState.workers.active,
            selectedID:dataID
          }
        }
      })
    }

    //Trigger this if workType tile clicked
    if(dataType=="workType" && dataID!==""){
      this.getJobsForTaskType(dataID)
      this.setState(prevState=>{
        return {
          workTypes:{
            data:prevState.workTypes.data,
            active:prevState.workTypes.active,
            selectedID:dataID
          }
        }
      })
    }

    // Trigger this if job tile clicked
    if(dataType=="job" && dataID!==""){
      this.setState({modalIsOpen:true})
      this.setState(prevState=>{
        return {
          jobs:{
            data:prevState.jobs.data,
            active:prevState.jobs.active,
            selectedID:dataID
          }
        }
      })
    }
  }
  componentDidMount(){
    $.ajax({
      type: "GET",
      url: "http://localhost:52098/api/Employee",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      //data: "{ workerId: " + WorkerId + "}",
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert("Error occured when log out validation was attempted.");

      },
      success: function (result) {
        this.setState({workers:{data:result,active:true,selectedID:0}});
    }.bind(this)
  });

  }
  
  render(){
    var WorkersList =[]
    var WorkTypesList = []
    var JobList = []
    let SelectedJob={}
    if(this.state.workers.data!==null)
      WorkersList = this.state.workers.data.map(worker=><Tile key={worker.ID} 
                                                          handleChange={this.handleChange} 
                                                          title={worker.Name} 
                                                          type="worker" 
                                                          selectedID={this.state.workers.selectedID}
                                                          id={worker.ID}
                                                          active={this.state.workers.active}
                                                          />)
    if(this.state.workTypes.data!==null)
      WorkTypesList = this.state.workTypes.data.map(workType=><Tile key={workType.ID} 
                                                                handleChange={this.handleChange} 
                                                                title={workType.Title} 
                                                                type="workType"
                                                                selectedID={this.state.workTypes.selectedID}
                                                                id={workType.Code}
                                                                active={this.state.workTypes.active}
                                                                />)
    if(this.state.jobs.data!==null)
      JobList = this.state.jobs.data.map(job=><Tile key={job.ID} 
                                                title={job.Title} 
                                                id={job.ID} 
                                                code={job.Code}
                                                handleChange={this.handleChange} 
                                                active={this.state.jobs.active}
                                                selectedID={this.state.jobs.selectedID}
                                                progress={job.PercentageComplete}
                                                type="job" />)
      
      if(parseInt(this.state.jobs.selectedID)!==0){
        SelectedJob=this.state.jobs.data.find(job=>job.ID===parseInt(this.state.jobs.selectedID));
      }
      
    return (
      <div className="Body">
        <div className="Header"></div>
          <div className="Content">
            <div className={this.state.workers.active?"workers-content":"workers-content-past"}>{WorkersList}</div>
            <div className={this.state.workTypes.active?"workTypes-content":"workTypes-content-past"}>{WorkTypesList}</div>
            <div className="jobs-content">{JobList}</div>
          </div>
          <Dialog isOpen={this.state.modalIsOpen} onClose={(e)=>this.setState({modalIsOpen:false})}>
              <ClaimForm workerID={this.state.workers.selectedID} workType={this.state.workTypes.selectedID} {...SelectedJob}/>
            </Dialog>
        <div className="Footer"></div>
      </div>
    );
  }
}





function ClaimItem() {
  $.ajax({
      method: "POST",
      url: "http://localhost:52098/api/Task/Claim/",
      data: { oid: 9, workTypeCode: "DO" },
      context: document.body
  }).done(function (data) {
      alert(data);
  });
}

export default App;

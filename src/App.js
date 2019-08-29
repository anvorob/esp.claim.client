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
          loading:false,
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
        beforeSend:function(xhr ){
          this.setState({loading:true})
        }.bind(this),
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
          this.setState({loading:false})
      }.bind(this)
    });
  }

  getJobsForTaskType(workTypeCode) {
    $.ajax({
        type: "GET",
        url: "http://localhost:52098/api/Task/" + workTypeCode,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend:function(){
          this.setState({loading:true})
        }.bind(this),
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
          this.setState({loading:false})
      }.bind(this)
    });
  }
  loginLogout(workerId)
  {
    let selectedWorker = this.state.workers.data.find(worker=>worker.ID==workerId)
    let url=selectedWorker.LoggedIn?selectedWorker.LogoutUrl :selectedWorker.LoginUrl
    //let message = document.getElementById("loginTextField").value;
    //console.log(message);
    //console.log(url)
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        //data:{message:message},
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            
            console.log(XMLHttpRequest.responseJSON)
            if(XMLHttpRequest.responseJSON.Message==="Late Log in, specify reason")
            {
              this.setState(prevState=>{
                console.log(workerId)
                return{ modalIsOpen:true,
                        workers:
                          {
                            data:prevState.workers.data,
                            active:true,
                            selectedID:workerId
                          }
                }})
            }
            if(XMLHttpRequest.responseJSON.Message==="You are logging out early")
            {
              this.setState(prevState=>{
                return{ modalIsOpen:true,
                        workers:
                          {
                            data:prevState.workers.data,
                            active:true,
                            selectedID:workerId
                          }
                }})
            }
        }.bind(this),
        success: function (result) {
            console.log(this.state)
              this.setState(prevState=>{
                prevState.workers.data.find(worker=>worker.ID==workerId).LoggedIn=!prevState.workers.data.find(worker=>worker.ID==workerId).LoggedIn
                  return{
                    workers:{
                      data:prevState.workers.data,
                      active:true,
                      selectedID:0
                    }
                  }
                }
              )
              
            }.bind(this)
    });
  }
  claimItem() {
    $.ajax({
        method: "POST",
        url: "http://localhost:52098/api/Task/Claim/",
        data: { oid: 9, workTypeCode: "DO" },
        context: document.body
    }).done(function (data) {
        alert(data);
    });
  }

  handleChange(event)
  {
    const {name,value,type,className,key} = event.target
    const dataType = event.target.getAttribute("data-Type");
    const dataID = event.target.getAttribute("data-id");
    // console.log(className);
    //console.log(dataID);
    //console.log(type)
    //Trigger this if login button clicked
    if(type=="submit" && dataID!==null)
    {
      this.loginLogout(dataID);
    }
    // Trigger this if worker tile clicked
    if(dataType=="worker" && dataID!==null)
    {
      if(this.state.workers.data.find(worker=>worker.ID==dataID).LoggedIn)
      {
        this.getTaskTypes(dataID)
        this.setState(prevState=>{
          return {
            workers:{
              data:prevState.workers.data,
              active:prevState.workers.active,
              selectedID:dataID
            }
          }
        })
      }else{
        alert("Log in first");
        // Resetting all tiles to original position
        this.setState(prevState=>{
          return {
            workers:{
              data:prevState.workers.data,
              active:true,
              selectedID:0
            }
          }
        })
        this.setState({
            workTypes:{
              data:[],
              active:false,
              selectedID:0
            }})
        this.setState({
            jobs:{
              data:[],
              active:false,
              selectedID:0
            }})
      }
    }

    //Trigger this if workType tile clicked
    if(dataType=="workType" && dataID!==null){
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
    if(dataType=="job" && dataID!==null){
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
                                                          loggedin={worker.LoggedIn}
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
          <div className={"loader-box"+(this.state.loading?" loader-box-active":"")}>
            <div className="loader"></div>
          </div>

          {/* Dont render if modal dialog is not being called */}
          {(this.state.modalIsOpen)?
            <Dialog isOpen={this.state.modalIsOpen} onClose={(e)=>this.setState({modalIsOpen:false})}>
              {
                (this.state.jobs.active)?
                    <ClaimForm workerID={this.state.workers.selectedID} workType={this.state.workTypes.selectedID} {...SelectedJob}/>:
                    <div>
                      <table>
                        <tbody>
                          <tr><td colSpan="2"><h3>You logged in late</h3></td></tr>
                          <tr><td valign="top">Reason for late login:</td><td><textarea rows="4" id="loginTextField"></textarea></td></tr>
                          <tr><td colSpan="2" align="right"><button data-id={this.state.workers.selectedID} onClick={this.handleChange}>OK</button><button onClick={(e)=>this.setState({modalIsOpen:false})}>Cancel</button></td></tr>
                        </tbody>
                      </table>
                    </div>
              }
              </Dialog>
            :""}
        <div className="Footer"></div>
      </div>
    );
  }
}


export default App;

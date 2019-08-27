import React,{Component} from 'react';
import './App.css';
import $ from 'jquery'; 
import Tile from "./Tile"

class App extends Component 
{
  constructor()
  {
      super()
      this.state={
          workers:[],
          workTypes:[],
          jobs:[]
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
          this.setState({workTypes:result});
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
          this.setState({jobs:result});
      }.bind(this)
    });
  }
  handleChange(event)
  {
    const {name,value,type,className,key} = event.target
    const dataType = event.target.getAttribute("data-Type");
    const dataID = event.target.getAttribute("data-id");
    if(dataType=="worker" && dataID!=="")
      this.getTaskTypes(dataID)
    console.log(name)
    console.log(value)
    console.log(dataType)
    console.log(className)
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
        this.setState({workers:result});
    }.bind(this)
  });

  }
  
  render(){
    var WorkersList =[]
    var WorkTypesList = []
    var JobList = []
    if(this.state.workers.length>0)
      WorkersList = this.state.workers.map(worker=><Tile key={worker.ID} 
                                                          handleChange={this.handleChange} 
                                                          title={worker.Name} 
                                                          type="worker" 
                                                          id={worker.ID}
                                                          />)
    if(this.state.workTypes.length>0)
      WorkTypesList = this.state.workTypes.map(workType=><Tile key={workType.ID} 
                                                                title={workType.Title} 
                                                                type="workType"
                                                                id={workType.ID}
                                                                />)
    if(this.state.jobs.length>0)
      JobList = this.state.jobs.map(job=><Tile key={job.ID} title={job.Name} type="job" />)
      
      
    return (
      <div className="Body">
        <div className="Header"></div>
          <div className="Content">
            <div className="workers-content panel">{WorkersList}</div>
            <div className="workTypes-content panel">{WorkTypesList}</div>
            <div className="jobs-content panel">{JobList}</div>
          </div>
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

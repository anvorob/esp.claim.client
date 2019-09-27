import React,{Component} from 'react';
import './App.css';
import './Dialog.css';
import './Notification.css';
import $ from 'jquery'; 
import Tile from "./Tile"
import Dialog from "./Dialog"
import Notification from "./Notification"
import ClaimForm from './ClaimForm'
import './bootstrap1.css';
import jsonFile from "./data.json"
import { isNullOrUndefined } from 'util';


class App extends Component 
{
  constructor()
  {
      super()
      this.state={
          loading:false,
          modalIsOpen:false,
          jobClaimOpen:false,
          apiUrl:"",
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
      // Bind Methods
      this.progressUpdate = this.progressUpdate.bind(this)
      this.handleChange = this.handleChange.bind(this)  
      this.getTaskTypes = this.getTaskTypes.bind(this)  
      this.getJobsForTaskType = this.getJobsForTaskType.bind(this) 
      this.getSelectedJob = this.getSelectedJob.bind(this)  
      this.claimItem = this.claimItem.bind(this) 
      this.claimJob = this.claimJob.bind(this)
      this.cancelClaim = this.cancelClaim.bind(this)
      this.progressValidation = this.progressValidation.bind(this)
  }

  getTaskTypes(workerID) {
    $.ajax({
        type: "GET",
        url: this.state.apiUrl+"/api/TaskType?oid="+workerID,
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
        url: this.state.apiUrl+"/api/Task/" + workTypeCode,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend:function(){
          this.setState({loading:true})
        }.bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed to get work types");
  
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
  getSelectedJob(SelectedJob,workTypeCode)
  {
      $.ajax({
        type: "GET",
        url: this.state.apiUrl+"/api/Task?jobId="+SelectedJob+"&workTypeCode=" + workTypeCode,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend:function(){
          this.setState({loading:true})
        }.bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed to get Jobs");

        },
        success: function (result) {
          
          this.setState(prevState=>{
            let oldJobs = prevState.jobs.data;
            this.cancelClaim()
            oldJobs.find(job=>job.ID==SelectedJob).TaskItems = result.TaskItems;
            return{
              jobs:{
                data:oldJobs,
                active:true,
                selectedID:SelectedJob
              }
            }
          }
        )
        
          this.setState({loading:false})
          this.setState({modalIsOpen:true})
      }.bind(this)
    });
  }

  loginLogout(workerId)
  {
    let selectedWorker = this.state.workers.data.find(worker=>worker.ID==workerId)
    let url=selectedWorker.LoggedIn?selectedWorker.LogoutUrl :selectedWorker.LoginUrl
    let outboundObj = {message:""}
    if(document.getElementById("loginTextField")!=null)
    outboundObj.message = document.getElementById("loginTextField").value;
    
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(outboundObj),
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) 
        {    
            
            if(XMLHttpRequest.responseJSON.Message==="Late Log in, specify reason")
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
            
              this.setState(prevState=>{
                prevState.workers.data.find(worker=>worker.ID==workerId).LoggedIn=!prevState.workers.data.find(worker=>worker.ID==workerId).LoggedIn
                  return{
                    modalIsOpen:false,
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

  claimItem(jobCode,claimAndExit) 
  {
    let taskList = this.state.jobs.data.find(job=>job.Code===jobCode);
    let jobItemsToClaim = taskList.TaskItems.filter(ti=>ti.hasOwnProperty("NewProgress"))
    let jobClaimObj = {
      worker:this.state.workers.selectedID,
      workTypeCode:this.state.workTypes.selectedID,
      jobItemList:jobItemsToClaim
    }

    
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: this.state.apiUrl+"/api/TaskItem/Claim/",
        dataType: "json",
        data: JSON.stringify(jobClaimObj),
        context: document.body
    }).done(function (data) {
        alert("Claimed");
        if(claimAndExit)        
        this.setState(prevState=>{
          return{
            workers:{data:prevState.workers.data,
                    active:true,
                    selectedID:0},
            loading:false,
            modalIsOpen:false,
            jobClaimOpen:false,
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
        })
    });
  }

  claimJob(claimAndExit){
    
    let claimedJobs = this.state.jobs.data.filter(ti=>ti.hasOwnProperty("NewProgress"))
    let jobClaimObj = {
      worker:this.state.workers.selectedID,
      workTypeCode:this.state.workTypes.selectedID,
      jobList:claimedJobs
    }
    
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: this.state.apiUrl+"/api/Task/Claim/",
        dataType: "json",
        data: JSON.stringify(jobClaimObj),
        context: document.body
    }).done(function (data) {
        alert("Claimed");
        if(claimAndExit)        
        this.setState(prevState=>{
          return{
            workers:{data:prevState.workers.data,
                    active:true,
                    selectedID:0},
            loading:false,
            modalIsOpen:false,
            jobClaimOpen:false,
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
        })
    });
  }
  progressUpdate(newValue,jobCode,workTypeID){
    
      this.setState(prevState=>{
        if(workTypeID==0){
            prevState.jobs.data.find(job=>job.Code===jobCode).NewProgress=newValue
        }
        else{
            prevState.jobs.data.find(job=>job.Code===jobCode).TaskItems.find(ti=>ti.ID===workTypeID).NewProgress=newValue
        }
        return{
          jobs:prevState.jobs,
          jobClaimOpen:(workTypeID==0)
        }
      })
      setTimeout(()=>this.progressValidation(jobCode,workTypeID), 500)
      
      //this.setState({currentProgress:e.currentTarget.value})
      
  }

  // This function is used to validate if new value is more than old.
  // If validation performed on the spot, current value will not be reset, hence this method is used
  progressValidation(jobCode,workTypeID){
    this.setState(prevState=>{
      if(workTypeID==0)
      {
        if(prevState.jobs.data.find(job=>job.Code===jobCode).Progress>=prevState.jobs.data.find(job=>job.Code===jobCode).NewProgress)
          delete prevState.jobs.data.filter(function(job)
            {
              return delete ((job.hasOwnProperty("NewProgress")&& job.Code===jobCode)?delete job.NewProgress:job)
            }) 
      }
      else 
      {
          let pr = prevState.jobs.data.find(job=>job.Code===jobCode).TaskItems.find(ti=>ti.ID===workTypeID).Progress
          let np = prevState.jobs.data.find(job=>job.Code===jobCode).TaskItems.find(ti=>ti.ID===workTypeID).NewProgress
          if(pr>=np)
          {
            
            delete prevState.jobs.data.find(job=>job.Code===jobCode).TaskItems.filter(function(ti){
              
              return delete ((ti.hasOwnProperty("NewProgress")&& ti.ID===workTypeID)?delete ti.NewProgress:ti)
            }) 
          }
      }
        
      return{
        jobs:prevState.jobs,
        jobClaimOpen:prevState.jobs.data.find(job=>job.hasOwnProperty("NewProgress"))
      }
    })
  }
  
  cancelClaim(){
    this.setState(
      prevState=>{
        delete prevState.jobs.data.filter(function(job){
          return delete (job.hasOwnProperty("NewProgress")?delete job.NewProgress:job)
        })
       
      return {
        jobs:prevState.jobs,
        jobClaimOpen:false
      }
    }
    )
  }
  handleChange(event)
  {
    const dataType = event.target.getAttribute("data-Type");
    const dataID = event.target.getAttribute("data-id");
    
   console.log(dataType)
   console.log(dataID)
    if(dataType==="jobclaim" && dataID!="")
    {
      this.setState(prevState=>{ 
            delete prevState.jobs.data.filter(function(job)
            {
              return (job.ID==dataID && job.hasOwnProperty("NewProgress"))?delete job.NewProgress:job
            }) 
            console.log(prevState.jobs.data.filter(job=>job.hasOwnProperty("NewProgress")).length)
            return {
              jobs:prevState.jobs,
              jobClaimOpen:(prevState.jobs.data.filter(job=>job.hasOwnProperty("NewProgress")).length>0)
            }
          })
            
    }
    //Trigger this if login button clicked
    if(dataType=="login" && dataID!==null)
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
    // Go back to worker selection
    if(dataType=="worker" && dataID==null)
    {
      this.setState(prevState=>{
        return {
          workers:{
            data:prevState.workers.data,
            active:true,
            selectedID:0
          },
          workTypes:{
            data:[],
            active:false,
            selectedID:0
          },
          jobs:{
            data:[],
            active:false,
            selectedID:0
          }
        }
      })
      
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

    // Reset selected worktype
    if(dataType=="workType" && dataID==null)
    {
      this.setState(prevState=>{
        return {
            workTypes:{
              data:prevState.workTypes.data,
              active:true,
              selectedID:0
            },
            jobs:{
              data:[],
              active:false,
              selectedID:0
            }
          }})
    }

    // Trigger this if job tile clicked
    if(dataType=="job" && dataID!==null){
      this.getSelectedJob(dataID,this.state.workTypes.selectedID);
      //console.log(dataID)
      console.log(this.state)
      
      // this.setState(prevState=>{
      //   return {
      //     jobs:{
      //       data:prevState.jobs.data,
      //       active:prevState.jobs.active,
      //       selectedID:dataID
      //     }
      //   }
      // })
    }
  }
  
  componentDidMount(){
    
    this.setState({apiUrl:jsonFile.apiUrl})

    setTimeout(()=>$.ajax({
      type: "GET",
      url: this.state.apiUrl+"/api/Employee",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert("Error occured when log out validation was attempted.");

      },
      success: function (result) {
        this.setState({workers:{data:result,active:true,selectedID:0}});
    }.bind(this)
  }),100);

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
                                                progressUpdate={this.progressUpdate}
                                                active={this.state.jobs.active}
                                                selectedID={this.state.jobs.selectedID}
                                                jobToBeClaimed={job.hasOwnProperty("NewProgress")}
                                                progress={(job.hasOwnProperty("NewProgress"))?job.NewProgress:job.Progress}
                                                type="job" />)
     // get list of claiming jobs 
    let jobList = this.state.jobs.data.filter(job=>job.hasOwnProperty("NewProgress")).map(singleJob=>{
                                                  return <tr>
                                                              <td><button onClick={this.handleChange} data-id={singleJob.ID}  data-type="jobclaim" >-</button></td>
                                                              <td>{singleJob.Code}</td>
                                                              <td>{singleJob.Progress +"% -> " +singleJob.NewProgress+"%"}</td>
                                                              <td>{singleJob.Stage}</td></tr>})
      if(parseInt(this.state.jobs.selectedID)!==0){
        SelectedJob=this.state.jobs.data.find(job=>job.ID===parseInt(this.state.jobs.selectedID));
      }
      
    return (
      <div className="Body">
        <div className="Header">
          <img src={require('./apl_logo.jpg')} className='logo'/>
          {
            
            (this.state.workers.active)?
            <h3 className="header-title">Workers</h3>:
            (this.state.workTypes.active)?
            <div><h5 className="header-title header-past"  data-type="worker" onClick={this.handleChange}>{this.state.workers.data.find(worker=>worker.ID==this.state.workers.selectedID).Name+"->"}</h5><h3 className="header-title">Work Types</h3></div>:
            (!isNullOrUndefined(this.state.workTypes.data) && this.state.workTypes.data.length>0)?<div><h5 className="header-title header-past"  data-type="worker" onClick={this.handleChange}>{this.state.workers.data.find(worker=>worker.ID==this.state.workers.selectedID).Name+"->"}</h5><h5  data-type="workType" onClick={this.handleChange} className="header-title header-past">{this.state.workTypes.data.find(wt=>wt.Code==this.state.workTypes.selectedID).Title+"->"}</h5><h3 className="header-title">Jobs</h3></div>:<div></div>
            // (this.state.workers.active)?
            // <h3 className="header-title">Workers</h3>:
            // (this.state.workTypes.active)?
            // <h3 className="header-title">Work Types</h3>:
            // <h3 className="header-title">Jobs</h3>
          }
        </div>
          <div className="Content">
            <div className={this.state.workers.active?"workers-content":"workers-content-past"}>{WorkersList}</div>
            <div className={this.state.workTypes.active?"workTypes-content":"workTypes-content-past"}>{WorkTypesList}</div>
            <div className={this.state.jobClaimOpen?"jobs-content":"jobs-content-wide"}>{JobList}</div>
            <div className={this.state.jobClaimOpen?"jobClaim-content":"hidden"}>
            <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Code</th>
                            <th>New Percentage</th>
                            <th>Stage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobList}
                    </tbody>
                </table>
                <button className="logBtn"  onClick={()=>this.claimJob(false)}>Submit</button>
                <button className="logBtn"  onClick={()=>this.claimJob(true)}>Submit & Exit</button>
                <button className="logBtn"  onClick={()=>this.cancelClaim}>Cancel</button>
              </div>
          </div>
          <div className={"loader-box"+(this.state.loading?" loader-box-active":"")}>
            <div className="loader"></div>
          </div>

          {/* Dont render if modal dialog is not being called */}
          {(this.state.modalIsOpen)?
            <Dialog isOpen={this.state.modalIsOpen} onClose={(e)=>this.setState({modalIsOpen:false})} dataType={this.state.jobs.active}>
              {
                (this.state.jobs.active)?
                    <ClaimForm workerName={this.state.workers.data.find(worker=>worker.ID+""===""+this.state.workers.selectedID).Name} workType={this.state.workTypes.selectedID} progressUpdate={this.progressUpdate} claimItem={this.claimItem} {...SelectedJob}/>:
                    // Login logout Modal part
                    <div>
                      <table>
                      <tbody>
                          <tr><td colSpan="2"><h3>You logged in late</h3></td></tr>
                          <tr><td valign="top">Reason for late login:</td><td><textarea rows="4" id="loginTextField"></textarea></td></tr>
                          <tr><td colSpan="2" align="right"><button data-id={this.state.workers.selectedID} className="logBtn" data-type="login" onClick={this.handleChange}>OK</button><button className="logBtn" onClick={(e)=>this.setState({modalIsOpen:false})}>Cancel</button></td></tr>
                      </tbody>
                      </table>
                  </div>
              }
              </Dialog>
            :""}
            {/* {(this.state.jobClaimOpen)?
              <Notification isOpen={this.state.jobClaimOpen} claimJob={this.claimJob} cancelClaim={this.cancelClaim} removeJobFromList={this.handleChange} jobs={this.state.jobs}/>:
              ""
            } */}
        <div className="Footer"></div>
      </div>
    );
  }
}


export default App;

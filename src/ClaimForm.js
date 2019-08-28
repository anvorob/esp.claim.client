import React,{Component} from 'react'
import ProgressBar from  'react-bootstrap/ProgressBar';

class ClaimForm extends Component{
render()
{
    if(this.props.hasOwnProperty("Title")){
        let currentProgress = parseInt(this.props.TaskTypeList.find(task=>task.Code==this.props.workType).PercentageCompleted)*100
        var currentDate = new Date()
        return (
            <div>
                <h1>Claim Form</h1>
                <table>
                    <tbody>
                    <tr><td>Job</td><td>{this.props.Title}</td></tr>
                    <tr><td>Work Type</td><td>{this.props.workType}</td></tr>
                    <tr><td>Job Progress</td><td><ProgressBar animated now={this.props.PercentageComplete} /></td></tr>
                    <tr><td>Current Progress</td><td>{currentProgress+"%"}<ProgressBar animated now={currentProgress} /></td></tr>
                    <tr><td>New Progress</td><td>{this.props.Title}</td></tr>
                    <tr><td>Date</td><td>{currentDate.getDay()+"-"+currentDate.getMonth()+" "+ currentDate.getHours()+":"+currentDate.getMinutes()}</td></tr>
                    <tr><td>Worker</td><td>{this.props.workerID}</td></tr>
                    <tr><td>Comment</td><td><textarea></textarea></td></tr>
                    <tr><td></td><td><button>Submit</button><button>Submit & Logout</button></td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
    else
        return(
          <div></div>  
        )
}

}


export default ClaimForm
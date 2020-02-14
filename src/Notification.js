import React,{Component} from 'react'

class Notification extends Component{

    render(){
        let jobList = this.props.jobs.data.filter(job=>job.hasOwnProperty("NewProgress")).map(singleJob=>{
                            return <tr>
                                        <td><button onClick={this.props.removeJobFromList} data-id={singleJob.ID}  data-type="jobclaim" >-</button></td>
                                        <td>{singleJob.Code}</td>
                                        <td>{singleJob.Progress +"% -> " +singleJob.NewProgress+"%"}</td>
                                        <td>{singleJob.Stage}</td></tr>})
        
        let dialog =(
            <div className="notification-content">
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
                <button className="logBtn"  onClick={this.props.claimJob(false)}>Submit</button>
                <button className="logBtn"  onClick={this.props.claimJob(true)}>Submit & Exit</button>
                <button className="logBtn"  onClick={this.props.cancelClaim}>Cancel</button>
            </div>
        );
        return (
            <div className={"notification"+((this.props.isOpen)?" notification-active":"")}>
                {dialog}
                
            </div>
        )
    }
}

export default Notification
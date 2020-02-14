import React,{Component} from 'react'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import {Handle, Tick,Track} from './SliderComp.js'


class ClaimForm extends Component{
    constructor(){
        super()
        this.state={
            currentProgress: 0 ,
            dateTime:"",
            comment:""
        }
        this.progressUpdateInternal = this.progressUpdateInternal.bind(this)  
        
    }
    componentDidMount(){
        this.setState({currentProgress:parseInt(this.props.TaskTypeList.find(task=>task.Code===this.props.workType).Progress*100)})
        var today = new Date(); 
        
        var dd = today.getDate(); 
        var mm = today.getMonth() + 1; 
  
        var yyyy = today.getFullYear(); 
        if (dd < 10) { 
            dd = '0' + dd; 
        } 
        if (mm < 10) { 
            mm = '0' + mm; 
        } 
        this.setState({dateTime:dd + '/' + mm + '/' + yyyy}) 
    }
    progressUpdateInternal(newValue,jobCode,workTypeID,callbackMethod){
        callbackMethod(newValue[0],jobCode,workTypeID)
      }
      
render()
{
    
    if(this.props.hasOwnProperty("Title")){
        
        var currentDate = new Date()
        var jobItems = []
        const sliderStyle = {  // Give the slider some width
            position: 'relative',
            width: '100%',
            height: 40
          }
          
          const railStyle = { 
            position: 'absolute',
            width: '100%',
            height: 10,
            marginTop: 15,
            borderRadius: 3,
            backgroundColor: '#252e38',
          }

    jobItems = this.props.TaskItems.map(jobItem=>{
        return jobItem.Progress<100?<tr>
                                        <td>{jobItem.Title+":"}</td>
                                        <td><Slider rootStyle={sliderStyle} domain={[0, 100]} step={1} mode={3} values={[(jobItem.hasOwnProperty("NewProgress"))?jobItem.NewProgress:jobItem.Progress]} onSlideEnd={(e)=>this.progressUpdateInternal(e,this.props.Code,jobItem.ID,this.props.progressUpdate)}>
                                            <div style={railStyle} />
                                            <Handles>
                                            {({ handles, getHandleProps }) => (
                                                <div className="slider-handles">
                                                {handles.map(handle => (
                                                    <Handle
                                                    key={handle.id}
                                                    handle={handle}
                                                    getHandleProps={getHandleProps}
                                                    />
                                                ))}
                                                </div>
                                            )}
                                            </Handles><Tracks right={false}>
                                                {({ tracks, getTrackProps }) => (
                                                <div className="slider-tracks">
                                                    {tracks.map(({ id, source, target }) => (
                                                    <Track
                                                        key={id}
                                                        source={source}
                                                        target={target}
                                                        getTrackProps={getTrackProps}
                                                    />
                                                    ))}
                                                </div>
                                                )}
                                            </Tracks></Slider></td>
                                    </tr>:""
    })
   
        return (
            <div>
                <h1>Claim Form</h1>
                <table className="claimFormTable">
                    <tbody>
                    <tr><td>Job</td><td>{"("+this.props.Code+ ") "+this.props.Title}</td></tr>
                    <tr><td>Work Type</td><td>{this.props.TaskTypeList.find(task=>task.Code===this.props.workType).Title}</td></tr>
                    <tr><td>Date:</td><td>{this.state.dateTime+" "+ currentDate.getHours()+":"+(currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes()}</td></tr>
                    <tr><td>Worker:</td><td>{this.props.workerName}</td></tr>
                    <tr><td>Job Progress</td><td><Slider rootStyle={sliderStyle} domain={[0, 100]} step={1} mode={3} values={[this.props.Progress]} disabled="true">
                                            <div style={railStyle} />
                                            <Handles>
                                            {({ handles, getHandleProps }) => (
                                                <div className="slider-handles">
                                                {handles.map(handle => (
                                                    <Handle
                                                    key={handle.id}
                                                    handle={handle}
                                                    getHandleProps={getHandleProps}
                                                    />
                                                ))}
                                                </div>
                                            )}
                                            </Handles><Tracks right={false}>
                                                {({ tracks, getTrackProps }) => (
                                                <div className="slider-tracks">
                                                    {tracks.map(({ id, source, target }) => (
                                                    <Track
                                                        key={id}
                                                        source={source}
                                                        target={target}
                                                        getTrackProps={getTrackProps}
                                                    />
                                                    ))}
                                                </div>
                                                )}
                                            </Tracks></Slider></td></tr>
                    {jobItems}
                    <tr><td>Comment:</td><td><textarea maxlength="50" rows="4" cols="50">{this.state.comment}</textarea></td></tr>
                    <tr><td></td><td><button className="logBtn" onClick={(e)=>this.props.claimItem(this.props.Code,false)}>Submit</button><button  className="logBtn" onClick={(e)=>this.props.claimItem(this.props.Code,true)}>Submit & Logout</button></td></tr>
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
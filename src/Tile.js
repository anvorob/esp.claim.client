import React,{Component} from "react"
import { Slider, Handles, Tracks } from 'react-compound-slider'
import {Handle, Track} from './SliderComp.js'

class Tile extends Component {
    constructor(){
        super()
        this.state={
            hover:false
        }
        this.hoverOn = this.hoverOn.bind(this)  
        this.hoverOff = this.hoverOff.bind(this) 
        this.progressUpdateInternal=this.progressUpdateInternal.bind(this)
        
    }
    hoverOn(){
        this.setState({ hover: true });
      }
    hoverOff(){ 
        this.setState({ hover: false });    
      }
      progressUpdateInternal(newValue,jobCode,workTypeCode,callbackMethod){
        callbackMethod(newValue[0],jobCode,workTypeCode)
      }
      
    render(){
        
        const sliderStyle = {  // Give the slider some width
            position: 'relative',
            width: '100%',
            height: 40,
            marginTop:'10px'
          }
          
          const railStyle = { 
            position: 'absolute',
            width: '100%',
            height: 10,
            marginTop: 15,
            borderRadius: 3,
            backgroundColor: '#252e38',
          }
          let classes =['title']
          classes.push((this.props.active)?this.props.type:this.props.type+"-past") 
          
          (this.state.hover===true || this.props.jobToBeClaimed)
          classes.push('hoveredTile')
          
          (this.props.selectedID+""===this.props.id+"")
          classes.push('active')

          (!this.props.loggedin && this.props.type==="worker")
          classes.push('loggedOut')

        //   className={"tile "+((this.props.active)?this.props.type:this.props.type+"-past") + 
        //             (this.state.hover===true || this.props.jobToBeClaimed?" hoveredTile":"") +  
        //             (this.props.selectedID+""===this.props.id+""?" active":"")+
        //             ((this.props.loggedin || this.props.type!=="worker")?"":" loggedOut")} 
        return(
            <div className={classes.join(' ')} 
                    onMouseOver={this.hoverOn} 
                    onMouseLeave={this.hoverOff} 
                    data-id={this.props.id}  
                    data-type={this.props.type} 
                    onClick={this.props.handleChange}>
                        
                {(this.props.type==="job")?"("+this.props.code+") "+this.props.title:this.props.title}
                {(this.props.type==="job")?<Slider rootStyle={sliderStyle} domain={[0, 100]} step={1} mode={3} values={[this.props.progress]} onSlideEnd={(e)=>this.progressUpdateInternal(e,this.props.code,0,this.props.progressUpdate)} >
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
                                            </Tracks></Slider>:""}
                <br/>
                {(this.props.type==="worker" && this.props.active)?<button className="logBtn" data-type="login" data-id={this.props.id}  >{((this.props.loggedin)?"Log out":"Log in")}</button>:""}
            </div>
        )
    }
}

export default Tile;
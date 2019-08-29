import React,{Component} from "react"
import ProgressBar from  'react-bootstrap/ProgressBar';

class Tile extends Component {
    constructor(){
        super()
        this.state={
            hover:false
        }
        this.hoverOn = this.hoverOn.bind(this)  
        this.hoverOff = this.hoverOff.bind(this)  
         
    }
    hoverOn(){
        this.setState({ hover: true });
      }
    hoverOff(){ 
        this.setState({ hover: false });    
      }
    render(){
        return(
            <div className={"tile "+((this.props.active)?this.props.type:this.props.type+"-past") + 
                    (this.state.hover===true?" hoveredTile":"") +  
                    (this.props.selectedID+""===this.props.id+""?" active":"")+
                    ((this.props.loggedin || this.props.type!=="worker")?"":" loggedOut")} 
                    onMouseOver={this.hoverOn} 
                    onMouseLeave={this.hoverOff} 
                    data-id={this.props.id}  
                    data-type={this.props.type} 
                    onClick={this.props.handleChange}>
                        
                {(this.props.type==="job")?"("+this.props.code+") "+this.props.title:this.props.title}
                {(this.props.type==="job")?<ProgressBar animated now={this.props.progress} />:""}
                <br/>
                {(this.props.type==="worker" && this.props.active)?<button data-id={this.props.id}  >{((this.props.loggedin)?"Log out":"Log in")}</button>:""}
            </div>
        )
    }
}

export default Tile;
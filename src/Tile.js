import React,{Component} from "react"

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
            <div className={"tile "+this.props.type + (this.state.hover===true?" hoveredTile":"")} 
                    onMouseOver={this.hoverOn} 
                    onMouseLeave={this.hoverOff} 
                    data-id={this.props.id}  
                    data-type={this.props.type} 
                    onClick={this.props.handleChange}>
                {this.props.title}
            </div>
        )
    }
}

export default Tile;
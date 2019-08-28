import React,{Component} from 'react'

class Dialog extends Component{

    render(){
        let dialog =(
            <div className="modal-content">
                <button className="close" onClick={this.props.onClose}>x</button>
                <div>{this.props.children}</div>
            </div>
        );
        return (
            <div className={"modal"+((this.props.isOpen)?" modal-active":"")}>
                {dialog}
            </div>
        )
    }
}

export default Dialog
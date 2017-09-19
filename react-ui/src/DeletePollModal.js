import React, { Component } from 'react';
//have to style this modal
export default class DeletePollModal extends Component {

  constructor(props){
    super(props);
    this.handleNoClicked = this.handleNoClicked.bind(this);
    this.handleYesClicked = this.handleYesClicked.bind(this);
  }

  handleNoClicked(){
    this.props.switchModal();
  }

  handleYesClicked(){
    //this.props.deletepollId;
    let requestConfig = {
      method: "DELETE",
      body: JSON.stringify({
        id: this.props.deletePollId
      }),
      headers: { "Content-type":"application/json" }
    }

    fetch(`/polls/${this.props.deletePollId}`, requestConfig)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.status === 'deleted'){
          //re-render the pollitem component
          this.props.deletePollItem();
        }
      })

  }

  render(){
    return (
      <div>
        <h5 style={{"textAlign":"center", "fontFamily":"Asap, Arial"}}>Are you <span style={{"color":"red"}}>sure</span> you want to delete the poll: {this.props.pollTitle}?</h5>
        <div className="yes-no-container">
          <div onClick={this.handleYesClicked} className="yes-btn">
            YES
          </div>
          <div  onClick={this.handleNoClicked} className="no-btn">
            NO
          </div>
        </div>
      </div>
    )
  }
}

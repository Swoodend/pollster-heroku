import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RandomPollButton from './RandomPollButton';


class DashboardNoPolls extends Component {

  constructor(props){
    super(props);
    this.randomPollButtonClicked = this.randomPollButtonClicked.bind(this);
    this.state = {
      fireRedirect : false,
      redirectId: null
    }
  }

  randomPollButtonClicked(id){
    console.log('poll button was clicked', id);
    // this.setState({
    //   fireRedirect : true,
    //   redirectId: id
    // });
  }


  render(){
    let currentUser = localStorage.getItem("currentUser");
    return (
      <div className="dash-container">
        <div className="dash-content">
          <h1 style={{"textAlign":"center"}}>{currentUser}, welcome to your dashboard.
            You have no polls yet.
          </h1>
          <div className="action-container">
            <div className="new-poll div-anchor"><Link to="/new">New Poll</Link></div>
            <RandomPollButton handleClick={this.randomPollButtonClicked}/>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardNoPolls;

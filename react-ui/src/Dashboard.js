import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DashboardNoPolls from './DashboardNoPolls';
import DashboardWithPolls from './DashboardWithPolls';

class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      currentUserPolls: []
    }
  }

  verifyLoggedIn(){
    return this.state.loggedIn;
  }

  componentWillMount(){
    let currentUser = localStorage.getItem('currentUser');
    fetch(`/${currentUser}/polls`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.type === "OK" && res.polls.length > 0 ){
          this.setState({
            loggedIn: true,
            currentUserPolls: res.polls
          });
        } else if (res.type === "OK"){
          this.setState({
            loggedIn: true
          });
        } else {
          console.log('SOMETHIGN WENT REALLY WROOONG', res.type);
        }
      })
  }

  render(){
    let view;
    console.log('rendering dashboard...login state:', this.state.loggedIn);
    if (this.verifyLoggedIn()){
      if (this.state.currentUserPolls.length > 0){
        view = <DashboardWithPolls/>
      } else {
        view = <DashboardNoPolls/>
      }
    } else {
      view = <Redirect to={{pathname: "/login", state: {type: "Warning", message:"Log in before viewing dashboard"}}}/>;
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}


export default Dashboard;

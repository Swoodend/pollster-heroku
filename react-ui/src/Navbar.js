import React, { Component } from 'react';
import NavbarNotLoggedIn from './NavbarNotLoggedIn';
import NavbarLoggedIn from './NavbarLoggedIn';

class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn : false
    }
  }

  componentWillMount(){
    let user = localStorage.getItem("currentUser");
    if (user){
      this.setState({
        loggedIn:user
      })
      // fetch(`/validate/${token}`)
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((token) => {
      //     if (token && token.user){
      //       this.setState({
      //         loggedIn : token.user
      //       });
      //     }
      //   })
    }
  }

  componentDidMount(){
    console.log('componentDidMount ran in navbar');
    let user = localStorage.getItem("currentUser");
    if (user){
      this.setState({
        loggedIn:user
      });
    }
  }

  render(){
    console.log('rendering nav', this.state);
    let nav = this.state.loggedIn ? <NavbarLoggedIn username={this.state.loggedIn}/> : <NavbarNotLoggedIn/>
    return (
      <div>
        {nav}
      </div>
    );
  }
}

export default Navbar;

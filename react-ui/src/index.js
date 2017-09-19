import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';


ReactDOM.render((
  <Router>
    <div>
      <Navbar/>
      <div style={{"margin-top":"55px"}}>
        <Route exact path="/" component={Home}/>
        <Route path="/signup" component={Signup}/>
        {/*
        <Route path="/login" component={Login}/>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/new" component={NewPoll}/>
        <Route path="/polls/:pollId" component={ViewPoll}/>
        */}
      </div>
    </div>
  </Router>),
  document.getElementById('root')
);

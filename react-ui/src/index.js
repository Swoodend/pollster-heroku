import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Home';
import './index.css';

ReactDOM.render(
  ReactDOM.render((
    <Router>
      <div>
        {/*<Navbar/>*/}
        <div style={{"margin-top":"55px"}}>
          <Route exact path="/" component={Home}/>
          {/*
          <Route path="/signup" component={Signup}/>
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
);

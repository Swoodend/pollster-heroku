import React, { Component } from 'react';
import Chart from 'chart.js';
import PollVotingForm from './PollVotingForm';
import FlashMessage from './FlashMessage';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
let poll;

class ViewPoll extends Component {

  constructor(props){
    super(props);
    this.updateChart = this.updateChart.bind(this);
    this.state = {
      id: '',
      pollTitle: '',
      pollAuthor: '',
      pollOptions: '',
      pollVotes: '',
      error: null,
      pollLeader: '',
      pollLeaderVotes: 0

    }
  }

  getPollLeader(arr){
    //returns index of largest number in array;

    let largest = arr.reduce((acc, num) => {
      return acc > num ? acc : num;
    })
    return arr.indexOf(largest);
  }

  componentDidMount(){
    let pollId = this.props.match.params.pollId;
    fetch(`/polls/${pollId}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.status === "OK"){
          //get poll leader and # of votes they have
          let leaderIndex= this.getPollLeader(res.pollData.votes);
          let pollLeader = res.pollData.options[leaderIndex];
          let pollLeaderVotes = res.pollData.votes[leaderIndex];

          this.setState({
            id: res.pollData.id,
            pollTitle: res.pollData.title,
            pollAuthor: res.pollData.author,
            pollOptions: res.pollData.options,
            pollVotes: res.pollData.votes,
            pollLeader,
            pollLeaderVotes
          }, () => {
            let ctx = document.getElementById('chart').getContext('2d');
            poll = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: this.state.pollOptions,
                datasets: [{
                  data: this.state.pollVotes,
                  backgroundColor: [
                    'deepskyblue',
                    '#FCB723',
                    'orange',
                    'rebeccapurple'
                  ],
                  borderColor: [
                    'black',
                    'black'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: false
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          });
        } else {
          console.log('unable to create poll');
        }
      })
  }

  updateChart(index){

    return new Promise((resolve, reject) => {
      let pollId = this.props.match.params.pollId;


      let requestConfig = {
        method: "POST",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          index
        })
      };

      fetch(`/polls/update/${pollId}`, requestConfig)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.status === "OK"){
            //you sucessfully voted
            let updatedVotes = res.updatedVotes;
            let leaderIndex= this.getPollLeader(updatedVotes);
            let pollLeader = this.state.pollOptions[leaderIndex];
            let pollLeaderVotes = updatedVotes[leaderIndex];


            this.setState({
              pollVotes: updatedVotes,
              pollLeader,
              pollLeaderVotes

            }, () => {
              poll.data.datasets[0].data = this.state.pollVotes;
              poll.update();
              resolve();

            });
          } else {
            if (res.status === "Already voted"){
              let errorType = res.status;
              let errorMessage = "Sorry, but we have already received a vote from this machine. Your vote was not recorded."
              this.setState(
                {
                  error: {
                    type: errorType,
                    message: errorMessage
                  }
                }, () => {
                  resolve();
                  window.setTimeout(() => {
                    this.setState(
                      {
                        error : null
                      }
                    )
                  }, 3000);
                }
              )
            } else {
              console.log('something VERY strange has occured');
              reject();
            }
          }
        }); //end of code
    }) //end of promise
  } //end of fn

  render(){
    let error = this.state.error ?
      <FlashMessage type={this.state.error.type} message={this.state.error.message}/> : null;

    let votingOptions = this.state.pollOptions ?
      <PollVotingForm
        updateChart={this.updateChart}
        options={this.state.pollOptions}
        title={this.state.pollTitle}
        votes={this.state.pollVotes}
        id={this.state.id}
        pollLeader={this.state.pollLeader}
        pollLeaderVotes={this.state.pollLeaderVotes}
      /> : null
    return (
      <div>
        <ReactCSSTransitionGroup transitionName={"flash"} transitionEnterTimeout={0} transitionLeaveTimeout={1000}>{error}</ReactCSSTransitionGroup>
          <h1 style={{"marginTop":"100px", "textAlign":"center"}}>{this.state.pollTitle}</h1>
          <div className="canvas-container">
            <canvas id="chart"></canvas>
          </div>
          {votingOptions}
      </div>
    );
  }
}

export default ViewPoll

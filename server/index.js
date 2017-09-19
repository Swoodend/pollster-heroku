const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./db/UserModel').User;
const Poll = require('./db/PollModel').Poll;
const jwt = require('jsonwebtoken');
const gm = require("getmac");
const PORT = process.env.PORT || 5000;

// Priority serve any static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
// app.get('/api', function (req, res) {
//   res.set('Content-Type', 'application/json');
//   res.send('{"message":"Hello from the custom server!"}');
// });

mongoose.connect(process.env.MONGOLAB_URI);

app.get('/validate/:token', (req, res) => {
  console.log('hit validate route');
  let token = req.params.token;
  if (token){
    jwt.verify(token, 'secret', (err, decoded) => {
      if(!err && decoded){
        res.json({user: decoded.username});
      } else {
        res.json({user: false});
      }
    });
  } else {
    res.json({user: false});
  }
});

app.post('/signup', (req, res) => {
  var hash = bcrypt.hashSync(req.body.password, 10);

  let user = new User ({
    email: req.body.email,
    username: req.body.username,
    password: hash,
    polls: []
  });

  user.save((err) => {
    if (!err){
      let token = jwt.sign({username: req.body.username, loggedIn: true}, 'secret');
      res.json({type: "OK", token: token});
    } else {
      if (err.code === 11000){
        res.json({type: "Error", message:"Email/Username is already in use"});
      } else {
        res.json({type: "Error", message:"Something went wrong"})
      }
    }
  });
});

app.post('/login', (req, res) => {
  User.findOne({'username': req.body.username}, (err, user) => {
    if (err) {
      res.json({type:"Error", message:"Something went wrong"});
    }

    if (!err && user){
      if (bcrypt.compareSync(req.body.password, user.password)){
        let token = jwt.sign({username: req.body.username, loggedIn: true}, 'secret');
        res.json({type: "OK", token: token, currentUser: req.body.username});
      } else {
        res.json({type:"Error", message:"Incorrect password. Please try again"});
      }
    } else {
      res.json({type:"Error", message: "Username does not exist"});
    }
  });
});

app.get("/:user/polls", (req, res) => {
  let user = req.params.user;
  Poll.find({author: user}, (err, pollArr) => {
    if (err) return console.log('something went wrong in /:user/polls', err);
    console.log('in /user/polls');
    console.log(pollArr);
    if(pollArr.length > 0){
      let totalVotes = pollArr.reduce((total, pollObj) => {
        total += pollObj.votes.reduce((subTotal, nextVal) => {
          return subTotal + nextVal;
        })
        return total;
      }, 0)

      let mostPopularPoll = pollArr.reduce((mostPopular, nextPoll) => {
        let mostPopVotes = mostPopular.votes.reduce((a, b) => {return a + b;});
        let nextPollVotes = nextPoll.votes.reduce((a, b) => {return a + b;});

        return mostPopVotes > nextPollVotes ? mostPopular : nextPoll
      })
      console.log('mostpop is', mostPopularPoll)
      res.json(
        {
          status: "OK",
          polls: pollArr,
          totalVotes,
          mostPopularPoll
        }
      );
    } else {
      res.json({
        polls: []
      })
    }
  })
});

app.delete('/polls/:pollId', (req, res) => {
  Poll.remove({id: req.body.id}, (err) => {
    if (err) return console.log('something went wrong in delete', err);
    res.json({
      status: 'deleted'
    })
  })
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

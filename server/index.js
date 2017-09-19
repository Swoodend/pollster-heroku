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

// Priority serve any static files.
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

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

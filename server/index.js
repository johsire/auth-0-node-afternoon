
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = reqiuire('axios');
const session = require('express-session');


// initialize express app:
const app = express();


// process.env destructures:
let {
  SERVER_PORT,
  SECRET
} = process.env;


// middlewares: parse application/json;
app.use(bodyParser.json());

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true
}));



// endpoints:
app.get('/callback', (req, res) => {

  // Code below

})

app.get('/api/user-data', (req, res) => {
  res.status(200).json(req.session.user)
})

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('logged out');
})


// Server port listening:
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`); });


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = reqiuire('axios');
const session = require('express-session');


// initialize express app:
const app = express();


// process.env destructures:
let {
  REACT_APP_CLIENT_ID,
  CLIENT_SECRET,
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
    exchangeCodeForAccessToken()
      .then(exchangeAccessTokenForUserInfo)
      .then(fetchAuth0AccessToken)
      .then(fetchGitHubAccessToken)
      // .then(setGitTokenToSession)
      .catch(error => {
          console.log(error, 'Server errror');
          res.status(500).send('An error occured on the server. Check the terminal');
      });

    function exchangeCodeForAccessToken() {
        const payload = {
            client_id: REACT_APP_CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: `http://${req.headers.host}/auth/callback`
          };

          return axios.post(`https://${REACT_APP_AUTH0_DOMAIN}/oauth/`)
    }  
},

app.get('/api/user-data', (req, res) => {
  res.status(200).json(req.session.user)
}),

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('logged out');
})
,

// Server port listening:
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`); });

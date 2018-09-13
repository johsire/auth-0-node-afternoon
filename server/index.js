require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');


// initialize express app:
const app = express();


// process.env destructures:
let {
  REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  SERVER_PORT,
  AUTH0_API_CLIENT_SECRET
} = process.env;


// middlewares: parse application/json;
app.use(bodyParser.json());

app.use(session({
  secret: AUTH0_API_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true
}));


// endpoints:
app.get('/callback', (req, res) => {
  exchangeCodeForAccessToken()
    .then(exchangeAccessTokenForUserInfo)
    .then(fetchAuth0AccessToken)
    .then(fetchGitHubAccessToken)
    .then(setGitTokenToSession)
    .catch(error => {
      console.log('Server error', error);
      res.status(500).send('An error occurred on the server. Check the terminal.');
    });

    function exchangeCodeForAccessToken() {
      const payload = {
        client_id: REACT_APP_AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `http://${req.headers.host}/auth/callback`
      };

      return axios.post(`https://${REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload);
    };

    function exchangeAccessTokenForUserInfo(accessTokenResponse) {
      const accessToken = accessTokenResponse.data.access_token;
      return axios.get(`https://${REACT_APP_AUTH0_DOMAIN}/userinfo?access_token=${accessToken}`);
    };

    function fetchAuth0AccessToken(userInfoResponse) {
      req.session.user = userInfoResponse.data;

      const payload = {
        grant_type: 'authorization_code',
        client_id: AUTH0_API_CLIENT_ID,
        client_secret: AUTH0_API_CLIENT_SECRET,
        audience: `https://{REACT_APP_AUTH0_DOMAIN}/api/v2`
      };

      return axios.post(`https://${REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload);
    };

    function fetchGitHubAccessToken() {
      const options = {
        headers: {
          authorization: `Bearer ${auth0AccessTokenResponse.data.access_token}`
        }
      };

        return axios.get(`https://${REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}`, options)
      };

      function setGitTokenToSession(gitHubAccessTokenResponse) {
        const gitHubIdentity = gitHubAccessTokenResponse.data.identities[0];
        req.session.gitHubAccessToken = gitHubIdentity.access_token;
        res.redirect('/');
      }
    },

  app.get('/api/user-data', (req, res) => {
    res.status(200).json(req.session.user)
  }),

  app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.send('logged out');
  }),



  // Server port listening:
  app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`);
  }));

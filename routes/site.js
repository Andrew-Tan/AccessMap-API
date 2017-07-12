'use strict';

const login    = require('connect-ensure-login');
const passport = require('passport');
const sso      = require('../sso/index');
const db = require('../db/index');

/**
 * https://localhost:4000/
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response that we send the string of "OAuth 2.0 Resource Server"
 * @returns {undefined}
 */
exports.index = (req, res) => {
  res.render('layout', { body: '<h1>OAuth 2.0 Resource Server</h1> ' +
  '<p> <a href="/logDemo">Try a demo</a>' });
};

/**
 * https://localhost:4000/login (GET)
 * The OAuth2 Resource Owner Password Credentials login form
 * being rendered.  Use this to enter a user id and password
 * which will then be sent to the Authorization server through
 * the grant type of "password"
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the login page of views/login.ejs is rendered
 * @returns {undefined}
 */
exports.loginForm = (req, res) => {
  res.render('login');
};

/**
 * https://localhost:4000/login (POST)
 *
 * The login endpoint when a post occurs through the login form
 */
exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

/**
 * https://localhost:4000/info
 * An information screen which first checks if the user is logged in through
 * the OAuth2 Resource Owner Password Credentials.  If the user is logged in,
 * then it sends the access token and refresh token to the page of views/info.ejs
 *
 * Although this uses login.ensureLoggedIn(), behind the scenes it's
 * using OAuth2's Resource Owner Password Credentials to authenticate
 * the user.  On Authentication, a regular web session is created, and
 * a access_token and refresh_token are attached.
 *
 * See auth.js's LocalStrategy
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the login page of info is rendered
 * @returns {undefined}
 */
exports.info = [
  login.ensureLoggedIn(),
  (req, res) => {
    const accessToken  = req.user.accessToken;
    const refreshToken = req.user.refreshToken;
    res.render('info', {
      access_token  : accessToken,
      refresh_token : refreshToken,
    });
  },
];

/**
 * https://localhost:4000/infosso
 *
 * An information screen which first checks if the user is logged in through
 * the OAuth2 Authorization Code on the authorization server.  This operates
 * as a single sign on session, since if the user is already authenticated with
 * the authorization server, then they're redirected back here, to the resource
 * server.  The authorization server holds a persistent session on the user's
 * machine through a cookie while the resource server only holds a session cookie.
 * If you close your browser and then reopen it, you will be directed to the
 * authorization server and then back to this, the resource server, but you will
 * not have to re-login back since your login is controlled through the authorization
 * server's persistent session/cookie.
 *
 * If you're not logged into the authorization server, then you will have to
 * enter your credentials with the authorization server's login form.  Once you're
 * logged in and you're redirected back to the resource server, the access token and
 * refresh token follows with the redirection per the OAuth2 Authorization Code grant.
 * The access token and (optionally) the refresh token are pushed to the client browser
 * to access API calls to protected endpoints.
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the infoss is rendered
 * @returns {undefined}
 */
exports.logDemo = [
  sso.ensureSingleSignOn(),
  (req, res) => {
    const accessToken  = req.session.accessToken;
    const refreshToken = req.session.refreshToken;
    res.render('demo', {
      access_token  : accessToken,
      refresh_token : refreshToken,
    });
  },
];

exports.saveLog = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const body = req.body;
    if (body.data == null) {
      return res.json({
        success: false,
        reason: 'Malformed post body',
      });
    }
    db.accessTokens.find(req.user)
    .then((tokenInfo) => {
      db.logData.save(tokenInfo.userID, 'AccessMap', req.body.data)
      .then((result) => {
        if (result === undefined) {
          return res.json({
            success: false,
            reason: 'Error saving data',
          });
        }
        return res.json({
          success: true,
          logged_content: result,
        });
      });
    })
    .catch(() => {
      res.status(500);
      res.json({ success: false, reason: 'Internal Server Error' });
    });
  },
];

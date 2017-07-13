'use strict';

const passport = require('passport');
const sso      = require('../sso/index');
const db = require('../db/index');
const utils = require('./utils');

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
exports.tokenDemo = [
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

exports.get = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    db.profile.find(req.user.userID, req.query.profileid)
    .then((result) => {
      if (result === undefined) {
        res.status(404);
        return res.json({ error: 'profile not found' });
      }
      return res.json(result);
    });
  },
];

exports.getAll = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    db.profile.findAll(req.user.userID)
    .then((result) => {
      if (result === undefined) {
        res.status(404);
        return res.json({ error: 'unknown error' });
      }
      return res.json(result);
    });
  },
];

exports.create = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    db.profile.save(req.user.userID, {
      profileName: req.body.profileName,
      inclineMin: req.body.inclineMin,
      inclineMax: req.body.inclineMax,
      inclineIdeal: req.body.inclineIdeal,
      avoidCurbs: req.body.avoidCurbs,
      avoidConstruction: req.body.avoidConstruction,
    })
    .then((result) => {
      if (result === undefined) {
        res.status(404);
        return res.json({ error: 'error creating profile' });
      }
      return res.json({
        userID: result.userID,
        profileName: result.profileName,
        inclineMin: result.inclineMin,
        inclineMax: result.inclineMax,
        inclineIdeal: result.inclineIdeal,
        avoidCurbs: result.avoidCurbs,
        avoidConstruction: result.avoidConstruction,
      });
    });
  },
];

exports.update = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const valueToUpdate = {
      profileName: req.body.profileName,
      inclineMin: req.body.inclineMin,
      inclineMax: req.body.inclineMax,
      inclineIdeal: req.body.inclineIdeal,
      avoidCurbs: req.body.avoidCurbs,
      avoidConstruction: req.body.avoidConstruction,
    };
    utils.cleanNullAttribute(valueToUpdate);

    db.profile.update(req.user.userID, parseInt(req.query.profileID, 10), valueToUpdate)
    .then((result) => {
      if (!result) {
        res.status(404);
        return res.json({ error: 'error updating profile' });
      }
      return res.json({
        success: 'profile updated',
      });
    });
  },
];

exports.delete = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    db.profile.delete(req.user.userID, parseInt(req.query.profileID, 10))
    .then((result) => {
      if (result === undefined) {
        res.status(404);
        return res.json({ error: 'error deleting profile' });
      }
      return res.json(result);
    });
  },
];

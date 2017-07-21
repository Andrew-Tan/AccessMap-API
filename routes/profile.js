'use strict';

const db = require('../db/index');
const utils = require('./utils');

exports.get = (req, res) => {
  db.profile.find(utils.retrieveTokenPayload(req)['sub'], req.query.profileid)
  .then((result) => {
    if (result === undefined) {
      res.status(404);
      return res.json({ error: 'profile not found' });
    }
    return res.json(result);
  });
};

exports.getAll = (req, res) => {
  db.profile.findAll(utils.retrieveTokenPayload(req)['sub'])
  .then((result) => {
    if (result === undefined) {
      res.status(404);
      return res.json({ error: 'unknown error' });
    }
    return res.json(result);
  });
};

exports.create = (req, res) => {
  db.profile.save(utils.retrieveTokenPayload(req)['sub'], {
    profileName: req.body.profileName,
    inclineMin: req.body.inclineMin,
    inclineMax: req.body.inclineMax,
    inclineIdeal: req.body.inclineIdeal,
    avoidCurbs: req.body.avoidCurbs,
    avoidConstruction: req.body.avoidConstruction,
  }).then((result) => {
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
};

exports.update = (req, res) => {
  const valueToUpdate = {
    profileName: req.body.profileName,
    inclineMin: req.body.inclineMin,
    inclineMax: req.body.inclineMax,
    inclineIdeal: req.body.inclineIdeal,
    avoidCurbs: req.body.avoidCurbs,
    avoidConstruction: req.body.avoidConstruction,
  };
  utils.cleanNullAttribute(valueToUpdate);

  db.profile.update(utils.retrieveTokenPayload(req)['sub'],
                    req.query.profileID, valueToUpdate)
  .then((result) => {
      if (!result) {
        res.status(404);
        return res.json({ error: 'error updating profile' });
      }
      return res.json({
        success: 'profile updated',
      });
    });
};

exports.delete = (req, res) => {
  db.profile.delete(utils.retrieveTokenPayload(req)['sub'], req.query.profileID)
  .then((result) => {
      if (result === undefined) {
        res.status(404);
        return res.json({ error: 'error deleting profile' });
      }
      return res.json(result);
    });
};

'use strict';

const request        = require('request');
const config         = require('../config');

/* eslint-disable camelcase */

const tokeninfoURL = config.authorization.tokeninfoURL;

exports.getTokenInfo = (access_token) => {
  return new Promise((resolve, reject) => {
    // Get and save token info
    request.get(tokeninfoURL + access_token, (error, response, body) => {
      if (error != null || response.statusCode !== 200) {
        return reject('Cannot Retrieve Token Info');
      }
      resolve(JSON.parse(body));
    });
  });
};

exports.cleanNullAttribute = (obj) => {
  const propNames = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < propNames.length; i += 1) {
    const propName = propNames[i];
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]; // eslint-disable-line no-param-reassign
    }
  }
};

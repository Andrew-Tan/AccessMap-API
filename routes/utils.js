'use strict';

/* eslint-disable camelcase */

exports.cleanNullAttribute = (obj) => {
  const propNames = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < propNames.length; i += 1) {
    const propName = propNames[i];
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]; // eslint-disable-line no-param-reassign
    }
  }
};

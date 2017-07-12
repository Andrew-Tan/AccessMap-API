'use strict';

// The access tokens.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens sequelize data structure which stores all the profiles
 */
const models = require('./models');

/**
 * Returns an profile if it finds one, otherwise returns undefined if one is not found.
 * @param   {Number}  userID - The token to decode to get the id of the access token to find.
 * @param   {Number}  profileID - The token to decode to get the id of the access token to find.
 * @returns {Promise} resolved with the token if found, otherwise resolved with undefined
 */
exports.find = async (userID, profileID) => {
  try {
    const result = await models.profile.findOne({
      where: {
        id: profileID,
        user_id: userID,
      }
    });

    if (result == null) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(result);
  } catch (error) {
    return Promise.resolve(undefined);
  }
}

exports.findAll = async (userID) => {
  // TODO: Better promise mechanism
  try {
    const result = await models.profile.findAll({
      where: {
        userID: userID,
      }
    });

    // TODO: check what will return on empty
    if (result === null) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(result);
  } catch (error) {
    return Promise.resolve(undefined);
  }
};

/**
 * Creates and saves a profile
 * @param   {Number}  userID              - The userID to be added
 * @param   {Object}  profile             - The new profile to be added
 * @returns {Promise} resolved with the saved token
 */
exports.save = async (userID, profile) => {
  profile.userID = userID;

  try {
    await models.profile.create(profile);
  } catch (error) {
    return Promise.resolve(undefined);
  }

  return Promise.resolve(profile);
};

/**
 * Updates a existing profile
 * @param   {Number}  userID              - The access token (required)
 * @param   {String}  profileID           - The expiration of the access token (required)
 * @param   {Object}  valueToUpdate       - The new profile to be added
 * @returns {Promise} resolved with the saved token
 */
exports.update = async (userID, profileID, valueToUpdate) => {
  try {
    await models.profile.update(valueToUpdate, {
      where: {
        id: profileID,
        userID,
      },
    });
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
}

/**
 * Deletes an profile token by getting the IDs and removing it from the storage.
 * @param   {Number}  userID - The token to decode to get the id of the access token to delete.
 * @param   {Number}  profileID - The token to decode to get the id of the access token to delete.
 * @returns {Promise} resolved with the deleted token or undefined if nothing is deleted
 */
exports.delete = async (userID, profileID) => {
  try {
    let deletedEntry = undefined;
    await models.sequelize.transaction(t => {
      return models.profile.findOne({
        where: {
          userID,
          profileID
        }
      }, {transaction: t}).then(code => {
        if (code ===  null) {
          throw new Error();
        }
        deletedEntry = code;
        return models.profile.destroy({
          where: {
            userID,
            profileID
          },
          truncate: true
        }, {transaction: t});
      });
    });
    return Promise.resolve(deletedEntry);
  } catch (error) {
    return Promise.resolve(undefined);
  }
};

/**
 * Removes all profiles
 * @returns {Promise} resolved with all removed tokens returned
 */
exports.removeAll = () => {
  // TODO: is not returning the correct thing.
  return models.profile.destroy({
    where: {},
  });
};
'use strict';

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

'use strict';

/**
 * Change this value to switch between production or development environment
 *
 * Should be one of the following values:
 * 'test' -> for testing purpose
 * 'production' -> for production purpose
 *
 * NOTE: this also correspond to the name of the presets in database configuration
 */
exports.deployMode = 'test';

/**
 * Change this value to enable/disable HTTPS scheme
 *
 * The HTTPS server is using self-signed certificate, refer to README in cert
 * for more detail
 */
exports.useHTTPSScheme = false;

/**
 * The client installation config for Keycloak, see
 * https://keycloak.gitbooks.io/documentation/securing_apps/topics/oidc/nodejs-adapter.html
 * for instruction.
 */
exports.client = {
  "realm": "AccessMap",
  "bearer-only": true,
  "auth-server-url": "https://oauth.accessmap.io/auth",
  "ssl-required": "external",
  "resource": "accessmap-api",
  "use-resource-role-mappings": true
};

/**
 * Database configuration
 *
 * development - development preset
 * test - test preset
 * production - production preset
 */
exports.database = {
  development: {
    dialect: 'sqlite',
    storage: './userdata.sqlite',
    logging: true,
  },
  // NOTE: DO NOT MODIFY preset "test" as it is used for unit tests. Change "deployMode"
  // to it during unit testing.
  test: {
    dialect: 'sqlite',
    storage: './userdata.sqlite',
    logging: false,
  },
  production: {
    dialect: 'mssql',
    host: 'hidden',
    port: 1433,
    dialectOptions: {
      encrypt: true,
    },
    database: 'hidden',
    username: 'hidden',
    password: 'hidden',
    logging: false,
  },
};

/**
 * Session configuration
 *
 * secret - The session secret that you should change to what you want
 */
exports.session = {
  // TODO You need to change this secret to something that you choose for your secret
  secret: 'A Secret That Should Be Changed',
};

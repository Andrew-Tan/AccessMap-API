'use strict';

const config         = require('./config');
const path           = require('path');
const site           = require('./routes/site');
const profile        = require('./routes/profile');

// Express configuration
const express        = require('express');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Settings
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, profileID');

  // intercepts OPTIONS method
  if (req.method === 'OPTIONS') {
    // respond with 200
    res.send(200);
  } else {
    // move on
    next();
  }
});

// Initialize Session
const model          = require('./db/models').sequelize;
const expressSession = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

const sequelizeStore = new SequelizeStore({ db: model });
app.use(expressSession({
  saveUninitialized : true,
  resave            : true,
  secret            : config.session.secret,
  store: sequelizeStore,
}));

// Keycloak
const Keycloak = require('keycloak-connect');

const keycloak = new Keycloak({
  store: sequelizeStore,
}, config.client);
app.use(keycloak.middleware());

app.get('/', site.index);
app.get('/api/profile', keycloak.protect(), profile.get);
app.post('/api/profile', keycloak.protect(), profile.create);
app.put('/api/profile', keycloak.protect(), profile.update);
app.delete('/api/profile', keycloak.protect(), profile.delete);
app.get('/api/profiles', keycloak.protect(), profile.getAll);

// static resources for stylesheets, images, javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Default route handler
app.use((req, res) => {
  res.status(404);
  res.json({
    error: '404 Not Found',
  });
});


console.log('Using HTTP');
app.listen(4040);
console.log('AccessMap API started on port 4040');


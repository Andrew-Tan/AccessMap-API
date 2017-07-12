AccessMap Data Logger
==================
This is the data logger to be used by AccessMap. The logger talks to the
OAuth server to identify the user/device sending the message and log valid
message into the database.

## Configuration
Edit config/index.js to specify where the OAuth server lives, what client
credential to be used, and what database to connect etc. Instructions
are attached as inline comment.

## Installation
```
cd AccessMap-Data-Logger
npm install
npm start
```

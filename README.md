AccessMap APIs
==================
This is the API server to be used by AccessMap App. The resource server talks to
OAuth server to identify the user/device and provide customized resources to
the apps.

## Configuration
Edit config/index.js to specify where the OAuth server lives, what client
credential to be used, and what database to connect etc. Instructions
are attached as inline comment.

## Installation
```
cd AccessMap-API
npm install
npm start
```

## APIs
Here are the APIs currently available

### Profile
| URL           | Method | Description                                   | Required Parameters       | Auth Required |
|---------------|--------|-----------------------------------------------|---------------------------|---------------|
| /api/profile  | GET    | Retrieve a profile with profile ID            | profileID                 | YES           |
| /api/profiles | GET    | Retrieve all profiles from the logged in user | N/A                       | YES           |
| /api/profile  | POST   | Update a profile with profile ID              | profileID newValues(body) | YES           |
| /api/profile  | PUT    | Create a profile                              | newValues(body)           | YES           |
| /api/profile  | DELETE | Delete a profile with profile ID              | profileID                 | YES           |

//core for http requests
var express = require("express");
//cors
var cors = require("cors");
//used for express-session storage
var session = require('express-session');
//body parser to inquire body expressions
var bodyParser = require('body-parser');
//used for debug
var morgan = require('morgan');
//instantiate express environment
var app = express();

app.use(cors())

//load config specs
app.config = require('../config.json');
//default api logger
app.use(morgan('dev'));
//default data transport
app.use(bodyParser.json());
//router for handling requests
app.appRouter = express.Router();
//jwt for security (http only is builtin)
app.jwt = require('jsonwebtoken');



// //simple cors headers
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
// //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// //  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
// //  res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });


/**
 * Token Protection
 */
app.use(function (req, res, next) {
  var anonymousServices = [
    "/authentication/verification",
    "/authentication/createpassword",
    "/authentication/signin"
  ]

  if (anonymousServices.indexOf(req.path) >= 0) {
    next();
  }
  else {
    if (app.config.enableSecurityToken) {
      var token = req.headers.authorization;
      if (token) {
        app.jwt.verify(token, app.config.secret, function (err, decoded) {
          if (err) {
            return res.status(403).json({ message: 'Failed to autenticate token' })
          } else {
            req.user = decoded;
            next();
          }
        });
      } else {
        return res.status(403).send({ message: 'No token provided.' });
      }
    }
  }
});

//Require All Controllers for Environment Setup.
require('../app/controllers/home-cotroller')(app);
require('../app/controllers/authentication-controller')(app);
require('../app/controllers/scan-controller')(app);
require('../app/controllers/counting-controller')(app);
require('../app/controllers/verification-controller')(app);
require('../app/controllers/transaction-controller')(app);
require('../app/controllers/overview-controller')(app);

require('../app/triggers/municipality.triggers')();
require('../app/triggers/polling.station.triggers')();
require('../app/triggers/user.actionvation.triggers')();


//mark the app to use the router 
app.use('', app.appRouter);
//start app on the configured port
var port = process.env.PORT || app.config.port;
app.listen(port);
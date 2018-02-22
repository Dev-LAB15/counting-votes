//core for http requests
var express = require("express");
//used for express-session storage
var session = require('express-session');
//body parser to inquire body expressions
var bodyParser = require('body-parser');
//used for debug
var morgan = require('morgan');

var app = express();
app.config = require('../config.json');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.appRouter = express.Router();
//jwt for security (http only is builtin)
app.jwt = require('jsonwebtoken');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


var unauthorized = [
  "/authentication/verification",
  "/authentication/createpassword",
  "/authentication/signin"
]



app.appRouter.use(function (req, res, next) {

  if (unauthorized.indexOf(req.path) >= 0){
    next();
    return;
  }

  var token = req.headers.token;
  if (token) {
    app.jwt.verify(token, app.config.secret, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to autenticate token' })
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      message: 'No token provided.'
    });
  }
});

require('../app/controllers/home-cotroller')(app);
require('../app/controllers/authentication-controller')(app);

app.use('', app.appRouter);
app.listen(app.config.port);
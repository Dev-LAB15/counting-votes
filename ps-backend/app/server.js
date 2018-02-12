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


app.appRouter.use(function (req, res, next) {
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
      success: false,
      message: 'No token provided.'
    });
  }
});

require('../app/controllers/home-cotroller')(app);
require('../app/controllers/authentication-controller')(app);

app.use('', app.appRouter);
app.listen(app.config.port);
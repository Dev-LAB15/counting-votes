/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
 
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
var configService = require('./services/config.service');

app.use(cors());

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

/**
 * This will initialize the blockchain address configrations.
 */
process.env.ALLOW_CONFIG_MUTATIONS = "true";

var promise;
var ganache = process.env.GANACHE;

if (ganache) {
  var addresses = require('../address.config.json');
  var owner = {
    address: "0x70c0D1904aa32a40d146c9C45a7CB883ea7fE84C",
    privateKey: "8115bf21f49fd36bd384827a830e843c9b4951dd663d9f60196a3bbea2237619"
  }
  promise = configService.initializeConfig("localhost:8545", owner, addresses.PollingStation, addresses.Municipality, addresses.UserActivation, addresses.Router);
} else {
  promise = configService.initializeConfig();
}

promise.then(() => {




  /**
   * This request pipe will restablish connections to the contracts in case the connection
   * is lost by a node sleeping or timeout  request.
   */
  app.use(function (req, res, next) {
    require('./contracts/user.activation.contract').reconnect();
    require('./contracts/municipality.contract').reconnect();
    require('./contracts/polling.station.contract').reconnect();
    next();
  })

  /**
   * Token Protection
   * This is a persistent solution that keeps track of the transported token
   * while it's valid through the application process.
   */
  app.use(function (req, res, next) {
    var anonymousServices = [
      "/authentication/createpassword",
      "/authentication/createpassword/",
      "/mayor/createpassword",
      "/mayor/createpassword/",
      "/mayor/signin",
      "/mayor/signin/",
      "/authentication/signin",
      "/authentication/signin/",
      "/authentication/signoff",
      "/authentication/signoff/",
      "/authentication/signout",
      "/authentication/signout/",
      "/twofactor/verification",
      "/twofactor/verification/",
      "/transaction/votes/all",
      "/transaction/votes/all/",
      "/transaction/scans/all",
      "/transaction/scans/all/",
      "/mayor/summary",
      "/mayor/summary/"
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
  require('../app/controllers/two-factor-controller')(app);
  require('../app/controllers/mayor-controller')(app);
  require('../app/controllers/scan-controller')(app);
  require('../app/controllers/counting-controller')(app);
  require('../app/controllers/verification-controller')(app);
  require('../app/controllers/transaction-controller')(app);
  require('../app/controllers/overview-controller')(app);
  /*
  require('../app/triggers/municipality.triggers')();
  require('../app/triggers/polling.station.triggers')();
  require('../app/triggers/user.actionvation.triggers')();
  */
  //mark the app to use the router 
  app.use('', app.appRouter);
  //start app on the configured port
  var port = process.env.PORT || app.config.port;

  app.listen(port);
});
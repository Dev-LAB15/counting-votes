var Router = artifacts.require("./router.sol");
var Permissions = artifacts.require("./Permissions.sol");
var Municipality = artifacts.require("./Municipality.sol");
var PollingStation = artifacts.require("./PollingStation.sol");
var UserActivation = artifacts.require("./UserActivation.sol");

module.exports = function(deployer) {
  deployer.deploy(Router).then(function() {
    console.log("Router", Router.address);
    return deployer.deploy(UserActivation).then(function() {
      return deployer
        .deploy(Municipality, UserActivation.address)
        .then(function() {
          deployer
            .deploy(
              PollingStation,
              Municipality.address,
              UserActivation.address
            )
            .then(function() {
              return PollingStation.address;
            });
        });
    });
  });
};

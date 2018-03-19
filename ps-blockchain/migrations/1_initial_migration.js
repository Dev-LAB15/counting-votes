var fs = require('fs');
var Migrations = artifacts.require("Migrations");
var Router = artifacts.require("./router.sol");
var Permissions = artifacts.require("./Permissions.sol");
var Municipality = artifacts.require("./Municipality.sol");
var PollingStation = artifacts.require("./PollingStation.sol");
var UserActivation = artifacts.require("./UserActivation.sol");

function copyFile(source, target) {
    var rd = fs.createReadStream(source);
    var wr = fs.createWriteStream(target);
    return new Promise(function (resolve, reject) {
        rd.on('error', reject);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    }).catch(function (error) {
        rd.destroy();
        wr.end();
        throw error;
    });
}


module.exports = function (deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(Router);
    deployer.deploy(UserActivation)
        .then(function () {
            deployer.deploy(Municipality, UserActivation.address)
                .then(function () {
                    deployer.deploy(PollingStation, Municipality.address, UserActivation.address).then(function () {
                        console.log('All Contracts Deployed!');
                        console.log('');

                        console.log(`Router Address: ${Router.address}`);
                        console.log(`UserActivation Address: ${UserActivation.address}`);
                        console.log(`Municipality Address: ${Municipality.address}`);
                        console.log(`PollingStation Address: ${PollingStation.address}`);
                    });
                });
        });
};

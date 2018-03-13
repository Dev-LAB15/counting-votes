var fs = require('fs');
var Migrations = artifacts.require("Migrations");
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
    var addressConfigJson = {
        "UserActivation": "",
        "Municipality": "",
        "PollingStation": ""
    }



    deployer.deploy(Migrations);
    deployer.deploy(UserActivation)
        .then(function () {
            deployer.deploy(Permissions, UserActivation.address)
                .then(function () {
                    deployer.deploy(Municipality, UserActivation.address)
                        .then(function () {
                            deployer.deploy(PollingStation, Municipality.address, UserActivation.address).then(function () {
                                addressConfigJson.UserActivation = UserActivation.address;
                                addressConfigJson.Municipality = Municipality.address;
                                addressConfigJson.PollingStation = PollingStation.address;
                                fs.writeFile('../ps-backend/address.config.json', JSON.stringify(addressConfigJson), 'utf8', function () {
                                    console.log('address configuration file written');
                                    copyFile('./build/contracts/UserActivation.json', '../ps-backend/app/contracts/abi/UserActivation.json');
                                    copyFile('./build/contracts/Municipality.json', '../ps-backend/app/contracts/abi/Municipality.json');
                                    copyFile('./build/contracts/PollingStation.json', '../ps-backend/app/contracts/abi/PollingStation.json');
                                });
                            });
                        });
                });
        });
};

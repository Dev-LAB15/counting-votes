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
    //deployer.deploy(Router);
    /*
    deployer.deploy(PollingStation, "0x741a3ffbfecd2011a0509408128b68a58a994c86", "0xa765679f4b58cd92a5c2e878ccfe332d05cf3cfa")
            .then(function(){
                console.log(`PollingStation Address: ${PollingStation.address}`);
            });
    */

    deployer.deploy(UserActivation)
        .then(function () {
            deployer.deploy(Municipality, UserActivation.address)
                .then(function () {

                    console.log('All Contracts Deployed!');
                    console.log('');
                    console.log(`Router Address: 0xa5d82075fbed8609731bf89feb12ca76837cc68b`);
                    console.log(`Municipality Address:   ${Municipality.address}`);
                    console.log(`UserActivation Address: ${UserActivation.address}`);

                    deployer.deploy(PollingStation, Municipality.address, UserActivation.address).then(function () {
                        console.log(`PS-134 Address: ${PollingStation.address}`);
                    });

                    deployer.deploy(PollingStation, Municipality.address, UserActivation.address).then(function () {
                        console.log(`PS-003 Address: ${PollingStation.address}`);
                    });

                    deployer.deploy(PollingStation, Municipality.address, UserActivation.address).then(function () {
                        console.log(`DESKTOP-8M1J54A Address: ${PollingStation.address}`);
                    });
                });
        });

};

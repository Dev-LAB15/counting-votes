var config = require('../../config.json');
var utils = require('../common/utils.js');
var routerContract = require('../contracts/router.contract');

module.exports.initializeConfig = function (pollingStationAddress, municipalityAddress, userActivationAddress, routerAddress) {
    var promise = new Promise(function (resolve, reject) {

        var isResolved = true;
        var isPollingStationResolved = true;
        var isMunicipalityResolved = true;
        var isUserActivationResolved = true;

        let computerName = utils.getComputerName();
        config.blockchain.pollingStationId = computerName;

        if (routerAddress) {
            config.blockchain.routerAddress = routerAddress;
        }

        if (pollingStationAddress) {
            config.blockchain.pollingStationAddress = pollingStationAddress;
        } else {
            isResolved = false;
            isPollingStationResolved = false;
            routerContract.getPollingStationAddress(computerName, function (_err, _data) {
                config.blockchain.pollingStationAddress = _data;
                isPollingStationResolved = true;
                if (isPollingStationResolved && isMunicipalityResolved && isUserActivationResolved) resolve();
            });
        }

        if (municipalityAddress) {
            config.blockchain.municipalityAddress = municipalityAddress;
        } else {
            isResolved = false;
            isMunicipalityResolved = false;
            routerContract.getMunicipalityAddress(computerName, function (_err, _data) {
                config.blockchain.municipalityAddress = _data;
                isMunicipalityResolved = true;
                if (isPollingStationResolved && isMunicipalityResolved && isUserActivationResolved) resolve();
            });
        }

        if (userActivationAddress) {
            config.blockchain.userActivationAddress = userActivationAddress;
        } else {
            isResolved = false;
            isUserActivationResolved = false;
            routerContract.getUacAddress(computerName, function (_err, _data) {
                config.blockchain.userActivationAddress = _data;
                isUserActivationResolved = true;
                if (isPollingStationResolved && isMunicipalityResolved && isUserActivationResolved) resolve();
            });
        }

        if (isResolved) {
            resolve();
        }
    });

    return promise;
}
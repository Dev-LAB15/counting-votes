var config = require('../../config.json');
let contract = require('../contracts/polling.station.contract');
var blockchainService = require('./blockchain.service');
/**
 * Records a QR Code, a Voter Pass, a Power of Attorney or an Oposition to the Pilot.
 * @param {string} qrCodeHash 
 * @param {number} voterType 
 * @param {{function(any, any)}} callback
 */
module.exports.recordVoter = function (wallet, qrCodeHash, voterType, callback) {
    var _params = [{ type: 'bytes32', value: qrCodeHash }, { type: 'uint8', value: voterType }];    
    blockchainService.executeFunction(wallet, config.addresses.pollingStation, 'recordVoter', _params, callback);
}

/**
 * Defines the address and the email for the user.
 * @param {string} address 
 * @param {string} email 
 * @param {function(any,any)} callback 
 */
module.exports.setUserRole = function (address, email, callback) {
    contract.methods.setUserRole(address, email, callback);
}

/**
 * Records a Vote for a Chairman Polling Station.
 * @param {string} voteOption 
 * @param {any} wallet 
 */
module.exports.recordVote = function (voteOption, wallet, callback) {
    var _params = [];
    var methodName;
    switch (voteOption) {
        case "vote-yes":
            methodName = "yes";
            break;
        case "vote-no":
            methodName = "no";
            break;
        case "vote-blank":
            methodName = "blank";
            break;
        default:
            methodName = "invalid";
            break;
    }
    blockchainService.executeFunction(wallet, config.addresses.pollingStation, methodName, _params, callback, "0");
}
/**
 * Signs in the current user assynchronously.
 * @param {any} wallet 
 * @param {function(any,any)} callback 
 */
module.exports.signIn = function (wallet, callback) {
    let _params = [];
    let methodName = "signIn";

    blockchainService.executeFunction(wallet, config.addresses.pollingStation, methodName, _params, callback, "0");
}

/**
 * Registers the control numbers to later verify if matches the total amount of registered votes.
 * @param {any} wallet
 * @param {number} pollingCards 
 * @param {number} powerOfAttorneys 
 * @param {number} voterPasses
 * @param {function(any)} callback
 */
module.exports.inputControlNumbers = function (wallet, pollingCards, powerOfAttorneys, voterPasses, callback) {
    let _params = [{ type: "uint256", value: pollingCards }, { type: "uint256", value: powerOfAttorneys }, { type: "uint256", value: voterPasses }];
    let methodName = "inputControlNumbers";

    blockchainService.executeFunction(wallet, config.addresses.pollingStation, methodName, _params, callback, "0");
}

/**
 * Verifies the registered votes with the pile count (verification step 2).
 * @param {any} wallet
 * @param {number} yesCount 
 * @param {number} noCount 
 * @param {number} blankCount
 * @param {number} invalidCount
 * @param {function(any)} callback
 */
module.exports.verifyVotes = function (wallet, yesCount, noCount, blankCount, invalidCount, callback) {
    let _params = [{ type: "uint256", value: yesCount }, { type: "uint256", value: noCount}, { type: "uint256", value: blankCount }, { type: "uint256", value: invalidCount }];
    let methodName = "verifyVotes";

    blockchainService.executeFunction(wallet, config.addresses.pollingStation, methodName, _params, callback, "0");
}
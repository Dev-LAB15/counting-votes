var config = require('../../config.json');
var blockchainService = require('./blockchain.service');
var contract = require('../contracts/municipality.contract');


/**
 * Signs in the current user assynchronously.
 * @param {any} wallet 
 * @param {function(any,any)} callback 
 */
module.exports.mayorSignIn = function (wallet, callback) {
    let _params = [];
    let methodName = "mayorSignIn";
    blockchainService.executeFunction(wallet, config.blockchain.municipalityAddress, methodName, _params, callback, "0");
}

/**
 * Gets an array of MayorSignedIn events from the contract.
 * @param {function(any,any)} callback 
 */
exports.getMayorSignedInEvent = function (callback) {
    contract.getMayorSignedInEvent(callback);
}
/**
 * Sets the mayor role before signin in
 * @param {string} email 
 * @param {string} address 
 * @param {function(any)} callback 
 */
exports.setMayorRole = function (email, address, callback) {
    let _params = [{ type: "address", value: address }, { type: "string", value: email }];
    blockchainService.executeFunction(config.blockchain.owner, config.blockchain.municipalityAddress, "setMayorRole", _params, callback, config.blockchain.defaultValueInEther);
}
/**
 * Gets an array of UserAdded events from the contract.
 * @param {function(any,any)} callback 
 */
exports.getUserAddedEvent = function (callback) {
    contract.getUserAddedEvent(callback);
}

exports.getRole = function (wallet, callback) {
    contract.getRole(wallet.address, callback);
}

exports.getSummary = function (callback) {
    contract.getSummary(callback);
}
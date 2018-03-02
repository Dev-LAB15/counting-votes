var config = require('../../config.json');
var blockchainService = require('./blockchain.service');
var contract = require('../contracts/user.activation.contract');
var crypto = require('crypto');
var ethwallet = require('ethereumjs-wallet');

/**
 * Requests the role of an user or if the user is registered on the block.
 * 0 user is not authorized
 * 1 user is owner
 * 2 user is mayor
 * 3 user is chairman
 * 4 user is teller
 * @param {string} email 
 * @param {function (any, any)} callback 
 * @returns {void}
 */
exports.getRoleId = function (email, callback) {
    contract.getRoleId(email, callback);
}
/**
 * Requests the contract if the email is registered.
 * @param {string} email 
 * @param {function(any, any)} callback 
 * @returns {void}
 */
exports.getUsedEmail = function (email, callback) {
    contract.getUsedEmail(email, callback);
}
/**
 * Generates an Ethereum wallet for the user based on the email and password.
 * @param {string } email 
 * @param {string } password 
 * @returns { any } wallet
 */
exports.getWallet = function (email, password) {
    let passphrase = email + password;
    //generates a sha256 address
    var hash = crypto.createHmac('sha256', config.secret);
    //updates the hash containing the passphrase
    hash.update(passphrase);
    //retrieves a private key based on the secret of the application
    var privateKey = hash.digest('hex');
    //generates a wallet with the combination of the email and the password
    var wallet = JSON.parse(ethwallet.fromPrivateKey(new Buffer(privateKey, 'hex')).toV3String('hex'));
    //captures the address from the wallet
    return wallet;
}
/**
 * Combines an email address with an ethereum address for further transactions.
 * @param {string} address 
 * @param {email} email 
 * @param {function(any)} callback 
 */
exports.setUserRole = function(email, address, callback){
    let _params = [{type: "address", value: address}, {type: "string", value: email}];
    blockchainService.executeFunction(config.blockchain.owner, config.addresses.pollingStation, "setUserRole", _params, callback, config.blockchain.defaultValueInEther);
}
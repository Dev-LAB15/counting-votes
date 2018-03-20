var config = require('../../config.json');
var addressConfig = require('../../address.config.json');
var blockchainService = require('./blockchain.service');
var contract = require('../contracts/user.activation.contract');
var pollingStationContract = require('../contracts/polling.station.contract');
var crypto = require('crypto');
var ethwallet = require('ethereumjs-wallet');
var vcodes = require('../data/verification.code.data');

/**
 * Requests a Verification Code for the user.
 * @param {string} email 
 * @param {string} code 
 */
exports.validateVerificationCode = function (email, code) {
    if (config.useVerificationCode) {
        try {
            var vcode = vcodes.find(email);
            var isValidCode = vcode && vcode.code == code;
            if (isValidCode) {
                vcodes.markUsed(vcode);
            }
            return isValidCode;
        } catch (err) {
            return false;
        }
    }
    return true;
}

/**
 * Requests the contract if the email is registered.
 * @param {string} email 
 * @param {function(error, boolean)} callback 
 * @returns {void}
 */
exports.getUsedEmail = function (email, callback) {
    contract.getUsedEmail(email, callback);
}

/**
 * Requests the role of an user or if the user is registered on the block.
 * 0 user is not authorized
 * 1 user is owner
 * 2 user is mayor
 * 3 user is chairman
 * 4 user is teller
 * @param {string} email 
 * @param {function (any, number)} callback 
 * @returns {void}
 */
exports.getRoleId = function (email, callback) {
    contract.getRoleId(email, callback);
}

/**
 * Verifies the role of a user on the block.
 * @param {any} wallet
 * @param {function(any)} callback 
 */
exports.getRole = function (wallet, callback) {
    pollingStationContract.getRole(wallet.address, callback);
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
    //redefines the address to include 0x string on heading
    wallet.address = `0x${wallet.address}`;
    //sets back the private key to the wallet in case of future uses
    wallet.privateKey = privateKey;
    //captures the address from the wallet
    //wallet.address = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
    //wallet.privateKey = "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f";     
    return wallet;
}

/**
 * Combines an email address with an ethereum address for further transactions.
 * @param {string} address 
 * @param {email} email 
 * @param {function(any)} callback 
 */
exports.setUserRole = function (email, address, callback) {
    let _params = [{ type: "address", value: address }, { type: "string", value: email }];
    blockchainService.executeFunction(config.blockchain.owner, config.blockchain.pollingStationAddress, "setUserRole", _params, callback, config.blockchain.defaultValueInEther);
}
/**
 * Executes the sign out procedure.
 * @param {wallet} wallet 
 * @param {funcion(any)} callback 
 */
exports.signOut = function (wallet, callback) {
    let _params = [];
    blockchainService.executeFunction(wallet, config.blockchain.pollingStationAddress, "signOut", _params, callback, "0");
}
var config = require('../../config.json');
var addressConfig = require('../../address.config.json');
var UserActivationJson = require('./abi/UserActivation.json');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));

/**
 * ABI for UserActivation Contract.
 * Only able to call readonly methods.
 */
var UserActivationAbi = UserActivationJson.abi;
//instance of the contract
var userActivation = new web3.eth.Contract(UserActivationAbi, addressConfig.UserActivation);

/**
 * Requests information if the getUsedEmail is 
 * @param {string} email 
 * @param {function(any,any)} callback 
 * @returns {void}
 */
module.exports.getUsedEmail = function (email, callback) {
	userActivation.methods.getUsedEmail(email).call({ from: config.blockchain.owner.address }, callback);
}
/**
 * Requests the role of an user or if the user is registered on the block.
 * 0 user is not authorized
 * 1 user is owner
 * 2 user is mayor
 * 3 user is chairman
 * 4 user is teller
 * @param {string } email 
 * @param {function (any, any)} callback 
 * @returns {void}
 */
module.exports.getRoleId = function (email, callback) {
	userActivation.methods.getRoleId(email).call({ from: config.blockchain.owner.address }, callback);
}

/**
 * Set a trigger to fire uppon an event
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
	userActivation.events[eventName](null, { fromBlock: 0, }, callback);
}
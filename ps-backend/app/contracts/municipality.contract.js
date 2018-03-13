var config = require('../../config.json');
var addressConfig = require('../../address.config.json');
var MunicipalityJson = require('./abi/Municipality.json');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));

/** 
 * Abi For Polling Station Rules.
*/
var MunicipalityAbi = MunicipalityJson.abi;


var municipality = new web3.eth.Contract(MunicipalityAbi, addressConfig.Municipality);

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {uint}
 */
module.exports.getYes = function (callback) {
    municipality.methods.getYes().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getNo = function (callback) {
    municipality.methods.getNo().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getBlank = function (callback) {
    municipality.methods.getBlank().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getInvalid = function (callback) {
    municipality.methods.getInvalid().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {string} qrCodeHash 
 * @param {function(any,any)} callback 
 * @returns {boolean}
 */
module.exports.userVoted = function (qrCodeHash, callback) {
    municipality.methods.userVoted(qrCodeHash).call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getRecounts = function (callback) {
    municipality.methods.getRecounts().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {boolean}
 */
module.exports.isValid = function (callback) {
    municipality.methods.isValid().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.getPastEvents = function (callback) {
    municipality.getPastEvents('allEvents', { fromBlock: 0 }, callback);
}

/**
 * Queries for the VoterCleared event for a defined polling card.
 * @param {function(error, result)} callback 
 */
module.exports.getVoterClearedEvents = function (callback) {
    municipality.getPastEvents('VoterCleared', { fromBlock: 0 }, callback);
}

/**
 * Set a trigger to fire uppon an event.
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
    var event = municipality.events[eventName](null, { fromBlock: 0, }, callback);
}
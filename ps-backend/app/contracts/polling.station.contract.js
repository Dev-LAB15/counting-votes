var config = require('../../config.json');
var addressConfig = require('../../address.config.json');
var PollingStationJson = require('./abi/PollingStation.json');
var Web3 = require('web3');


var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
/** 
 * Abi For Polling Station Rules.
 */
var PollingStationAbi = PollingStationJson.abi;

var pollingStation = new web3.eth.Contract(PollingStationAbi, addressConfig.PollingStation);

module.exports.Abi = PollingStationAbi;

/**
 * Requests if the user data is assigned to any role on the block.
 * @param {address} callerAddress 
 * @param {function(any,any)} callback 
 */
module.exports.getRole = function (callerAddress, callback) {
	pollingStation.methods.getRole().call({ from: callerAddress }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getDeviation = function (callback) {
	pollingStation.methods.getDeviation().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {boolean}
 */
module.exports.getVerification = function (callback) {
	pollingStation.methods.getVerification().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getVotingRound = function (callback) {
	pollingStation.methods.getVotingRound().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {boolean}
 */
module.exports.isSessionOpen = function (callback) {
	pollingStation.methods.isSessionOpen().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int scannedPollingCards, int registeredVoterPasses, int scannedPowerOfAttorneys, int registeredPowerOfAttorneys, int registeredObjections, int collectedPollingCards, int collectedVoterPasses, int collectedPowerOfAttorneys}
 */
module.exports.getReport = function (callback) {
	pollingStation.methods.getReport().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.allEvents = function (callback) {
	pollingStation.events.allEvents({ fromBlock: 0 }, callback);
}
/**
 * Captures all past events
 * @param {function(error, any)} callback 
 */
module.exports.getPastEvents = function (callback) {
	pollingStation.getPastEvents('allEvents', { fromBlock: 0 }, callback);
}
/**
 * Captures the VotingSessionBegan event
 * @param {function(error, any)} callback 
 */
module.exports.getVotingSessionBeganEvent = function (callback) {
	pollingStation.getPastEvents('VotingSessionBegan', { fromBlock: 0 }, callback);
}
/**
 * Captures the UserSignedIn event.
 * @param {function(error, any)} callback 
 */
module.exports.getSignedInEvent = function (callback) {
	pollingStation.getPastEvents('UserSignedIn', { fromBlock: 0 }, callback);
}
/**
 * Set a trigger to fire uppon an event
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
	var event = pollingStation.events[eventName](null, { fromBlock: 0, }, callback);
}
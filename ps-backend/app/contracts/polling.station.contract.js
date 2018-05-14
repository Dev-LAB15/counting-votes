/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
var config = require('../../config.json');
var PollingStationJson = require('./abi/PollingStation.json');
var Web3 = require('web3');
var PollingStationAbi = PollingStationJson.abi;

var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
var pollingStation = new web3.eth.Contract(PollingStationAbi, config.blockchain.pollingStationAddress);

module.exports.reconnect = function () {
	web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
	pollingStation = new web3.eth.Contract(PollingStationAbi, config.blockchain.pollingStationAddress);
}

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
 * Checks if session is enabled to be finished.
 * @param {*} callback 
 */
module.exports.canSubmit = function (callback) {
	pollingStation.methods.canSubmit().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.getDeviation = function (callback) {
	pollingStation.methods.getDeviation().call({ from: config.blockchain.owner.address }, callback);
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

module.exports.getVoteCounted = function (callback) {
	pollingStation.once('VoteCounted', { fromBlock: 0 }, callback);
}

/**
 * Set a trigger to fire uppon an event
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
	var event = pollingStation.events[eventName](null, { fromBlock: 0, }, callback);
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
 * Watches the ControlNumbersAdded event when it happens.
 * @param {function(error, any)} callback 
 */
module.exports.getControlNumbersAddedEvent = function (callback) {
	pollingStation.getPastEvents('ControlNumbersAdded', { fromBlock: 0 }, callback);
}

/**
 * Watches the ControlNumbersAdded event when it happens.
 * @param {function(error, any)} callback 
 */
module.exports.getControlNumbersAddedEvent = function (callback) {
	pollingStation.getPastEvents('ControlNumbersAdded', { fromBlock: 0 }, callback);
}
/**
 * Captures the vote counted event
 * @param {function(error,any)} callback 
 */
module.exports.getVoteCountedEvent = function (callback) {
	pollingStation.getPastEvents('VoteCounted', { fromBlock: 0 }, callback);
}

module.exports.getUserAddedEvent = function (callback) {
	pollingStation.getPastEvents('UserAdded', { fromBlock: 0 }, callback);
}
/**
 * Get's signed in tellers from the polling station
 * @param {function(any, number)} callback 
 */
module.exports.getSignedInTellers = function (callback) {
	pollingStation.methods.getSignedInTellers().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.getVerificationDoneEvent = function (callback) {
	pollingStation.getPastEvents('VerificationDone', { fromBlock: 0 }, callback);
}

module.exports.getSignedOffEvent = function (callback) {
	pollingStation.getPastEvents('SignedOff', { fromBlock: 0 }, callback);
}

/**
 * Gets the address for the associated municipality
 * @param {function(any,any)} callback 
 * @returns {string address}
 */
module.exports.getMunicipalityAddress = function (callback) {
	pollingStation.methods.getMunicipalityAddress().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * Gets the address for the associated user activation contract
 * @param {function(any,any)} callback 
 * @returns {string address}
 */
module.exports.getUacAddress = function (callback) {
	pollingStation.methods.getUacAddress().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.getVoterClearedEvent = function (callback) {
	pollingStation.getPastEvents('VoterCleared', { fromBlock: 0 }, callback);
}

module.exports.getVoterAlreadyRecordedEvent = function (callback) {
	pollingStation.getPastEvents('VoterAlreadyRecorded', { fromBlock: 0 }, callback);
}

module.exports.getUserSignedOutEvent = function (callback) {
	pollingStation.getPastEvents('UserSignedOut', { fromBlock: 0 }, callback);
}
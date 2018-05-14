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
var UserActivationJson = require('./abi/UserActivation.json');
var Web3 = require('web3');

var UserActivationAbi = UserActivationJson.abi;
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
var userActivation = new web3.eth.Contract(UserActivationAbi, config.blockchain.userActivationAddress);

module.exports.reconnect = function () {
	web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
	userActivation = new web3.eth.Contract(UserActivationAbi, config.blockchain.userActivationAddress);
}

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
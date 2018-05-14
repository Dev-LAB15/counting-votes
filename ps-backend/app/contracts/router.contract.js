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
var RouterJson = require('./abi/Router.json');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));

/**
 * ABI for UserActivation Contract.
 * Only able to call readonly methods.
 */
var RouterAbi = RouterJson.abi;
//instance of the contract
var router = new web3.eth.Contract(RouterAbi, config.blockchain.routerAddress);

/**
 * Requests the blockchain address of a polling station based in its identifier 
 * @param {string} pollingStationId 
 * @param {function(any,any)} callback 
 * @returns {string}
 */
module.exports.getPollingStationAddress = function (pollingStationId, callback) {
	return router.methods.getPollingStationAddress(pollingStationId).call({ from: config.blockchain.owner.address }, callback);
}

/**
 * Requests the blockchain address of a polling station's parent municipality based in its identifier 
 * @param {string} pollingStationId 
 * @param {function(any,any)} callback 
 * @returns {string}
 */
module.exports.getMunicipalityAddress = function (pollingStationId, callback) {
	return router.methods.getMunicipalityAddress(pollingStationId).call({ from: config.blockchain.owner.address }, callback);
}

/**
 * Requests the polling station id based on its blockchain contract address
 * @param {string} pollingStationAddress 
 * @param {function(any,any)} callback 
 * @returns {string}
 */
module.exports.getPollingStationId = function (pollingStationAddress, callback) {
	return router.methods.getPollingStationId(pollingStationAddress).call({ from: config.blockchain.owner.address }, callback);
}

/**
 * Requests the blockchain address of a polling station's parent municipality based in its identifier 
 * @param {string} pollingStationId 
 * @param {function(any,any)} callback 
 * @returns {string}
 */
module.exports.getUacAddress = function (pollingStationId, callback) {
	return router.methods.getUacAddress(pollingStationId).call({ from: config.blockchain.owner.address }, callback);
}

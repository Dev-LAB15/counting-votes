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
var blockchainService = require('./blockchain.service');
var contract = require('../contracts/municipality.contract');
var router = require('../contracts/router.contract');


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

exports.querySummary = function (pollingStation, callback) {
    if (pollingStation != '0') {
        router.getPollingStationAddress(pollingStation, function (err, address) {
            var Web3 = require('web3');
            var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
            var PollingStationAbi = require('../contracts/abi/PollingStation.json').abi;
            var pollingStation = new web3.eth.Contract(PollingStationAbi, address);
            pollingStation.methods.getReport().call({ from: config.blockchain.owner.address }, callback);
        });
    }
    else {
        contract.getSummary(callback);
    }
}

exports.canSignOff = function (callback) {
    contract.canSignOff(callback);
}

exports.signOff = function (wallet, callback) {
    let _params = [];
    let methodName = "signOff";
    blockchainService.executeFunction(wallet, config.blockchain.municipalityAddress, methodName, _params, callback, "0");
}
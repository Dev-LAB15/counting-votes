var config = require('../../config.json');
var addressConfig = require('../../address.config.json');
var RouterJson = require('./abi/Router.json');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));

/**
 * ABI for UserActivation Contract.
 * Only able to call readonly methods.
 */
var RouterAbi = RouterJson.abi;
//instance of the contract
var router = new web3.eth.Contract(RouterAbi, addressConfig.Router);

/**
 * Requests the blockchain address of a polling station based in its identifier 
 * @param {string} pollingStationId 
 * @param {function(any,any)} callback 
 * @returns {string}
 */
module.exports.getAddress = function (pollingStationId, callback) {
	return router.methods.getAddress(pollingStationId).call({ from: config.blockchain.owner.address }, callback);
}
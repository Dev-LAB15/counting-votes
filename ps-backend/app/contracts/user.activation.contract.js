var Web3 = require('web3');
var config = require('../../config.json');
var web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.provider));

/**
 * ABI for UserActivation Contract.
 * Only able to call readonly methods.
 */
var UserActivationAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "email",
				"type": "string"
			},
			{
				"name": "assignedUserRole",
				"type": "uint8"
			}
		],
		"name": "addEmail",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "email",
				"type": "string"
			}
		],
		"name": "setUsedEmail",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"name": "a",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "email",
				"type": "string"
			}
		],
		"name": "getUsedEmail",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "email",
				"type": "string"
			}
		],
		"name": "getRoleId",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "NotAllowed",
		"type": "event"
	}
];
//instance of the contract
var userActivation = new web3.eth.Contract(UserActivationAbi, config.addresses.userActivation);

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
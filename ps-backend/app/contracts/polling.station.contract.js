var Web3 = require('web3');
var config = require('../../config.json');

var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.wsProvider));
/** 
 * Abi For Polling Station Rules.
 */
var PollingStationAbi = [
	{
		"constant": true,
		"inputs": [],
		"name": "getReport",
		"outputs": [
			{
				"name": "scannedPollingCards",
				"type": "uint256"
			},
			{
				"name": "registeredVoterPasses",
				"type": "uint256"
			},
			{
				"name": "scannedPowerOfAttorneys",
				"type": "uint256"
			},
			{
				"name": "registeredPowerOfAttorneys",
				"type": "uint256"
			},
			{
				"name": "registeredObjections",
				"type": "uint256"
			},
			{
				"name": "collectedPollingCards",
				"type": "uint256"
			},
			{
				"name": "collectedVoterPasses",
				"type": "uint256"
			},
			{
				"name": "collectedPowerOfAttorneys",
				"type": "uint256"
			},
			{
				"name": "yes",
				"type": "uint256"
			},
			{
				"name": "no",
				"type": "uint256"
			},
			{
				"name": "blank",
				"type": "uint256"
			},
			{
				"name": "invalid",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "VOTING_START_TIMESTAMP",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDeviation",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRole",
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
		"constant": true,
		"inputs": [],
		"name": "getVerification",
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
		"inputs": [],
		"name": "getVotingRound",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isSessionOpen",
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
		"inputs": [],
		"name": "munContract",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "pollingCards",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "powerOfAttorneys",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "voterPasses",
				"type": "uint256"
			}
		],
		"name": "ControlNumbersAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "qrCodeHash",
				"type": "bytes32"
			}
		],
		"name": "VoterCleared",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "yes",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "qrCodeHash",
				"type": "bytes32"
			}
		],
		"name": "VoterAlreadyRecorded",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "no",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "yes",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "no",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "blank",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "invalid",
				"type": "bool"
			}
		],
		"name": "VerificationAttempt",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "invalid",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "signOut",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "recount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "UserSignedOut",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "signIn",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "UserSignedIn",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "explanation",
				"type": "string"
			}
		],
		"name": "signOff",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "uAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "email",
				"type": "string"
			}
		],
		"name": "UserCreationFailed",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "beginVotingSession",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "qrCodeHash",
				"type": "bytes32"
			},
			{
				"name": "voterType",
				"type": "uint8"
			}
		],
		"name": "recordVoter",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "message",
				"type": "string"
			}
		],
		"name": "NotAllowed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "staff",
				"type": "address"
			}
		],
		"name": "StaffSignedOff",
		"type": "event"
	},
	{
		"inputs": [
			{
				"name": "mAddress",
				"type": "address"
			},
			{
				"name": "uacAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "UserAdded",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pollingCards",
				"type": "uint256"
			},
			{
				"name": "powerOfAttorneys",
				"type": "uint256"
			},
			{
				"name": "voterPasses",
				"type": "uint256"
			}
		],
		"name": "inputControlNumbers",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "pollingStation",
				"type": "address"
			}
		],
		"name": "VotingFinished",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "blank",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "yesCount",
				"type": "uint256"
			},
			{
				"name": "noCount",
				"type": "uint256"
			},
			{
				"name": "blankCount",
				"type": "uint256"
			},
			{
				"name": "invalidCount",
				"type": "uint256"
			}
		],
		"name": "verifyVotes",
		"outputs": [
			{
				"name": "yesVerified",
				"type": "bool"
			},
			{
				"name": "noVerified",
				"type": "bool"
			},
			{
				"name": "blankVerified",
				"type": "bool"
			},
			{
				"name": "invalidVerified",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			},
			{
				"name": "email",
				"type": "string"
			}
		],
		"name": "setUserRole",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}
];

var pollingStation = new web3.eth.Contract(PollingStationAbi, config.addresses.pollingStation);

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

/**
 * Set a trigger to fire uppon an event
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
	var event = pollingStation.events[eventName](null, {
		fromBlock: 0,
	}, callback);
}

module.exports.allEvents = function (callback) {
	pollingStationContract.events.allEvents({ fromBlock: 0 }, callback);
}

module.exports.getPastEvents = function (callback) {
	pollingStationContract.getPastEvents('allEvents', { fromBlock: 0 }, callback);
}
var Web3 = require('web3');
var config = require('../../config.json');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.wsProvider));

/** 
 * Abi For Polling Station Rules.
*/
var MunicipalityAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "getInvalid",
        "outputs": [
            {
                "name": "",
                "type": "uint128"
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
        "name": "getBlank",
        "outputs": [
            {
                "name": "",
                "type": "uint128"
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
                "name": "qrCodeHash",
                "type": "bytes32"
            }
        ],
        "name": "userVoted",
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
        "name": "getNo",
        "outputs": [
            {
                "name": "",
                "type": "uint128"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getRecounts",
        "outputs": [
            {
                "name": "",
                "type": "uint128"
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
        "name": "isValid",
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
        "name": "getYes",
        "outputs": [
            {
                "name": "",
                "type": "uint128"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "uacAddress",
                "type": "address"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "qrCodeHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "howMany",
                "type": "uint256"
            }
        ],
        "name": "VoterAlreadyRecorded",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "voteYes",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "voteInvalid",
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
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
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
        "inputs": [],
        "name": "voteBlank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "YesVoted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "BlankVoted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "InvalidVoted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "NoVoted",
        "type": "event"
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
                "name": "qrCodeHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "voterType",
                "type": "uint8"
            }
        ],
        "name": "VoterCleared",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "enrollPollStation",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "voteNo",
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
    }
];


var municipality = new web3.eth.Contract(MunicipalityAbi, config.addresses.municipality);

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

/**
 * Set a trigger to fire uppon an event.
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
    var event = municipality.events[eventName](null, { fromBlock: 0, }, callback);
}

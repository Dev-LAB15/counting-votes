var Web3 = require('web3');
var config = require('../../config.json');
var web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.provider));
/** 
 * Abi For Polling Station Rules.
*/
var PollingStationAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "duplicityError",
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
        "inputs": [],
        "name": "voteNo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "constant": false,
        "inputs": [],
        "name": "voteYes",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "cardsClaimed",
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
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "whosError",
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
        "constant": false,
        "inputs": [],
        "name": "voteBlank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
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
        "anonymous": false,
        "inputs": [],
        "name": "YesVoted",
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
        "inputs": [],
        "name": "InvalidVoted",
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
                "name": "role",
                "type": "uint8"
            }
        ],
        "name": "UserAdded",
        "type": "event"
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
    }
];


var PollingStationAbi = new web3.eth.Contract(PollingStationAbi, config.addresses.userActivation);

/**
 * 
 * @param {string} qrCodeHash 
 * @param {number} voterType
 * @param {function(any,any)} callback 
 * @returns {void}
 */
module.exports.recordVoter = function(qrCodeHash, voterType, callback){
    PollingStationAbi.methods.recordVoter(qrCodeHash, voterType).call({ from: config.blockchain.owner.address }, callback);
}
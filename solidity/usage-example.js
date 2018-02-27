var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://leaderlsuery.westeurope.cloudapp.azure.com:8545'));

//Get the contract ABI (the JSON object below) from remix interface.
var contract = web3.eth.contract([
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "EmailAddresses",
		"outputs": [
			{
				"name": "",
				"type": "string"
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
				"name": "email",
				"type": "string"
			}
		],
		"name": "AddEmail",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]).at("0xa8a99280cfccb1936a14cde90c96185a9e0e5953");

contract.AddEmail("chairmain@lab15.io");

// How to unlock accounts.
// geth attach
// personal.unlockAccount(eth.accounts[1])
// lab15@DLT
var Web3 = require('web3');
var config = require('../../config.json');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));

var psContract = require('../contracts/polling.station.contract');
var mnContract = require('../contracts/municipality.contract');

module.exports = function (app) {
    app.get('/transaction/list', function (req, res) {
        psContract.getPastEvents(function (err, events) {
            //the voter events can't exceed a maximum value of 10
            var voterEvents = [];
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                switch (event.event) {
                    case "VoterCleared":
                        voterEvents.push({ transactionHash: event.transactionHash, error: false });
                        break;
                    case "VoterAlreadyRecorded":
                        voterEvents.push({ transactionHash: event.transactionHash, error: true });
                        break;
                    default:
                        break;
                }
            }
            //reverses the array
            voterEvents.reverse();
            console.log(voterEvents);
            res.json(voterEvents);
        });
    });

    

    app.get('/transaction/scans', function (req, res) {
        var maxLength = 10;
        var result = [];
        psContract.getVoterClearedEvent(function (err, voterClearedEvents) {
            if (voterClearedEvents && voterClearedEvents instanceof Array && voterClearedEvents.length > 0) {
                voterClearedEvents.reverse();
                if (voterClearedEvents.length <= 10)
                    maxLength = voterClearedEvents.length;
                for (let i = maxLength - 1; i >= 0; i--) {
                    let evt = voterClearedEvents[i];
                    let blockHash = evt.blockHash;
                    let transactionHash = evt.transactionHash;
                    let timestamp = null;
                    var scan = {
                        blockHash: blockHash,
                        transactionHash: transactionHash,
                        timestamp: timestamp
                    }
                    result.push(scan);
                }
            }

            for (let i = 0; i < result.length; i++) {
                if (!result[i])
                    continue;
                web3.eth.getBlock(result[i].blockHash, function (err, blockResult) {
                    if (result[i]) {
                        result[i].timestamp = blockResult.timestamp;
                    }
                });
            }
        });
        setTimeout(() => {
            res.json(result);
        }, 10 * 1000);
    });
    app.get('/transaction/votes', function (req, res) {
        var maxLength = 10;
        var result = [];
        psContract.getVoteCountedEvent(function (err, voteCountedEvents) {
            if (voteCountedEvents && voteCountedEvents instanceof Array && voteCountedEvents.length > 0) {
                voteCountedEvents.reverse();
                if (voteCountedEvents.length <= 10)
                    maxLength = voteCountedEvents.length;
                for (let i = maxLength - 1; i >= 0; i--) {
                    let evt = voteCountedEvents[i];
                    let blockHash = evt.blockHash;
                    let transactionHash = evt.transactionHash;
                    let timestamp = null;
                    var scan = {
                        blockHash: blockHash,
                        transactionHash: transactionHash,
                        voteCode: evt.returnValues.voteCode,
                        timestamp: timestamp
                    }
                    result.push(scan);
                }
            }

            for (let i = 0; i < result.length; i++) {
                if (!result[i])
                    continue;
                web3.eth.getBlock(result[i].blockHash, function (err, blockResult) {
                    if (result[i]) {
                        result[i].timestamp = blockResult.timestamp;
                    }
                });
            }
        });
        setTimeout(() => {
            res.json(result);
        }, 10 * 1000);
    });

    app.get('/transaction/log', function (req, res) {
        var block = web3.eth.getBlock('latest', function (err, res) {
            console.log(res);
            for (var i = 0; i < res.transactions.length; i++) {
                var tx = res.transactions[i];
                console.log(tx)
                var receipt = web3.eth.getTransactionReceipt(tx, function (_err, _res) {
                    console.log(_res);
                });
            }
        });
        mnContract.getPastEvents(function (err, events) {
            var sendBack = true;
            //the voter events can't exceed a maximum value of 10
            var voterEvents = [];
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                if (!event) {
                    continue;
                }

                event.blockNumber;
                switch (event.event) {
                    case "VoterCleared":
                        voterEvents.push({ transactionHash: event.transactionHash, blockNumber: event.blockNumber, error: false });
                        break;
                    case "VoterAlreadyRecorded":
                        voterEvents.push({ transactionHash: event.transactionHash, blockNumber: event.blockNumber, error: true });
                        break;
                    default:
                        break;
                }
            }
            res.json(voterEvents);
        });
    });

    
    app.get('/transaction/scans/all', function (req, res) {
        var maxLength = 10;
        var result = [];
        mnContract.getVoterClearedEvents(function (err, voterClearedEvents) {
            if (voterClearedEvents && voterClearedEvents instanceof Array && voterClearedEvents.length > 0) {
                voterClearedEvents.reverse();
                if (voterClearedEvents.length <= 10)
                    maxLength = voterClearedEvents.length;
                for (let i = maxLength - 1; i >= 0; i--) {
                    let evt = voterClearedEvents[i];
                    let blockHash = evt.blockHash;
                    let transactionHash = evt.transactionHash;
                    let timestamp = null;
                    var scan = {
                        blockHash: blockHash,
                        transactionHash: transactionHash,
                        timestamp: timestamp
                    }
                    result.push(scan);
                }
            }

            for (let i = 0; i < result.length; i++) {
                if (!result[i])
                    continue;
                web3.eth.getBlock(result[i].blockHash, function (err, blockResult) {
                    if (result[i]) {
                        result[i].timestamp = blockResult.timestamp;
                    }
                });
            }
        });
        setTimeout(() => {
            res.json(result);
        }, 10 * 1000);
    });

    app.get('/transaction/votes/all', function (req, res) {
        var maxLength = 10;
        var result = [];
        mnContract.getVoteCountedEvents(function (err, voteCountedEvents) {
            if (voteCountedEvents && voteCountedEvents instanceof Array && voteCountedEvents.length > 0) {
                voteCountedEvents.reverse();
                if (voteCountedEvents.length <= 10)
                    maxLength = voteCountedEvents.length;
                for (let i = maxLength - 1; i >= 0; i--) {
                    let evt = voteCountedEvents[i];
                    let blockHash = evt.blockHash;
                    let transactionHash = evt.transactionHash;
                    let timestamp = null;
                    var scan = {
                        blockHash: blockHash,
                        transactionHash: transactionHash,
                        voteCode: evt.returnValues.voteCode,
                        timestamp: timestamp
                    }
                    result.push(scan);
                }
            }

            for (let i = 0; i < result.length; i++) {
                if (!result[i])
                    continue;
                web3.eth.getBlock(result[i].blockHash, function (err, blockResult) {
                    if (result[i]) {
                        result[i].timestamp = blockResult.timestamp;
                    }
                });
            }
        });
        setTimeout(() => {
            res.json(result);
        }, 10 * 1000);
    });
}
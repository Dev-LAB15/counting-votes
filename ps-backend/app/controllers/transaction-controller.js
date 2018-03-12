var Web3 = require('web3');
var config = require('../../config.json');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.wsProvider));

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

    app.get('/transaction/log', function (req, res) {

        mnContract.getPastEvents(function (err, events) {
            var sendBack = true;
            //the voter events can't exceed a maximum value of 10
            var voterEvents = [];
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
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

    
}
let pollingstationService = require('../services/pollingstation.service');
let pollingStationContract = require('../contracts/polling.station.contract');
let decoder = require('abi-decoder');
let config = require('../../config.json');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.wsProvider));
decoder.addABI(pollingStationContract.Abi);


module.exports = function (app) {
    //Inputs the control numbers required by verification step 2.
    app.post('/verification/inputcontrolnumbers', function (req, res) {
        try {
            let wallet = req.user.wallet;
            let pollingCards = req.body.pollingCards;
            let powerOfAttorneys = req.body.powerOfAttorneys;
            let voterPasses = req.body.voterPasses;

            pollingstationService.inputControlNumbers(wallet, pollingCards, powerOfAttorneys, voterPasses, function (data) {
                if (data.status) {
                    res.send('Ok');
                } else {
                    res.status(502).json();
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error.' });
        }

    });

    app.post('/verification/verifyvotes', function (req, res) {
        try {
            let wallet = req.user.wallet;
            let yesCount = req.body.yesCount;
            let noCount = req.body.noCount;
            let blankCount = req.body.blankCount;
            let invalidCount = req.body.invalidCount;

            pollingstationService.verifyVotes(wallet, yesCount, noCount, blankCount, invalidCount, function (data) {
                if (data.status) {
                    var returnModel = {};
                    var transactionReceiptPromise = null;
                    var transactionReceipt = null;

                    var receiptAttempt = setInterval(function () {
                        transactionReceiptPromise = web3.eth.getTransactionReceipt(data.message);
                        transactionReceiptPromise.then(function (data) {
                            transactionReceipt = data;
                        });

                        if (transactionReceipt != null) {
                            clearInterval(receiptAttempt);

                            const decodedLogs = decoder.decodeLogs(transactionReceipt.logs);
                            decodedLogs[0].events.forEach(element => {
                                returnModel[element.name] = element.value;
                            });

                            res.json(returnModel);
                        }
                    }, 2000);
                } else {
                    res.status(502).json();
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error.' });
        }

    });

    app.post('/verification/recount', function (req, res) {
        try {
            let wallet = req.user.wallet;

            pollingstationService.recount(wallet, function (data) {
                if (data.status) {
                    res.send('Ok');
                } else {
                    res.status(502).json();
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error.' });
        }

    });

}
let pollingstationService = require('../services/pollingstation.service');

module.exports = function (app) {
    //Inputs the control numbers required by verification step 2.
    app.post('/verification/inputcontrolnumbers', function (req, res) {
        try {
            let wallet = req.user.wallet;
            let pollingCards = req.body.pollingCards;
            let powerOfAttorneys = req.body.powerOfAttorneys;
            let voterPasses = req.body.voterPasses;
            var ControlNumbersAdded_Event = function (receipt) {
                pollingstationService.getControlNumbersAddedEvent(function (err, controlNumbersEvents) {
                    var confirmed = false;
                    if (controlNumbersEvents && controlNumbersEvents instanceof Array && controlNumbersEvents.length > 0) {
                        for (let i = 0; i < controlNumbersEvents.length; i++) {
                            let controlNumbersEvent = controlNumbersEvents[i];
                            if (controlNumbersEvent.transactionHash == receipt)
                                confirmed = true;
                        }
                    }
                    if (confirmed) {
                        res.send({ message: 'ok' });
                    }
                    else {
                        ControlNumbersAdded_Event(receipt);
                    }
                });
            }
            pollingstationService.inputControlNumbers(wallet, pollingCards, powerOfAttorneys, voterPasses, function (inputControlNumbersReceipt) {
                ControlNumbersAdded_Event(inputControlNumbersReceipt.message);
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

            var getVerificationDoneEvent = function (receipt) {
                pollingstationService.getVerificationDoneEvent(function (err, verificationDoneEvents) {
                    var confirmed = false;
                    var result;
                    if (verificationDoneEvents && verificationDoneEvents instanceof Array && verificationDoneEvents.length > 0) {
                        for (let i = 0; i < verificationDoneEvents.length; i++) {
                            if (verificationDoneEvents[i].transactionHash == receipt) {
                                confirmed = true;
                                result = verificationDoneEvents[i];
                            }

                        }
                    }
                    if (confirmed) {
                        res.json(result.returnValues);
                    }
                    else {
                        getVerificationDoneEvent(receipt);
                    }
                });
            }

            pollingstationService.verifyVotes(wallet, yesCount, noCount, blankCount, invalidCount, function (verifyVotesReceipt) {
                if (verifyVotesReceipt.status) {
                    getVerificationDoneEvent(verifyVotesReceipt.message);
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

    app.get('/verification/getdeviation', function (req, res) {
        pollingstationService.getDeviation(function (err, result) {
            res.json({ deviation: result });
        });
    });

}
var utils = require('../common/utils');
var countingData = require('../data/counting.data');
var pollingStationService = require('../services/pollingstation.service');

module.exports = function (app) {
    /**
     * Records a vote transaction and keep it waiting for the confirmation
     * from the block.
     * At this moment the transaction is kept waiting, otherwise the
     * webservice will throw a 422 exception.
     */
    app.post('/counting/vote', function (req, res) {
        var wallet = req.user.wallet;
        var option = req.body.option;
        //converted into a callback in case of retrial
        //the timeout enables a single retrial recursively
        //if the transaction is confirmed the setTimeout is ignored.     

        //don't allow the finish counting while a transaction is still in place.
        var recordVote = function (_option, _wallet, _callback) {
            var transaction;
            pollingStationService.recordVote(option, wallet, function (data) {
                transaction = data.message;
                var transactionObject = {
                    timestamp: utils.timestamp(),
                    transaction: data.message,
                    option: option,
                    status: 'waiting'
                }
                countingData.insert(transactionObject);
                //wait for control numbers to be inserted
                var voteRecorded_Event = function () {
                    pollingStationService.getVoteCountedEvent(function (err, evt) {
                        var txConfirmed = false;
                        if (evt && evt instanceof Array && evt.length > 0) {
                            for (var i = 0; i < evt.length; i++) {
                                console.log(evt);
                                if (evt[i].transactionHash == transaction) {
                                    txConfirmed = true;
                                    countingData.update(transaction);
                                    break;
                                }

                            }
                            if (!txConfirmed)
                                voteRecorded_Event();
                        }
                    });
                }
                //straight call to the event firing procedure
                voteRecorded_Event();
            });

        }

        //call the recordVote again in case the transaction takes too long
        //or is dropped by the node
        //this will fire another recursive attempt
        recordVote(option, wallet, recordVote);
        res.status(200).json({ message: 'ok' });
    });

    app.get('/counting/canfinish', function (req, res) {
        var pending = countingData.hasAnyPending();
        if (pending) {
            res.status(422).json({ message: 'There are still pending transactions, please wait' });
        } else {
            res.send({ message: 'ok' });
        }
    });


}
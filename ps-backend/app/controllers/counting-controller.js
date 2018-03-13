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
        
        var recordVote = function (_option, _wallet, _callback) {            
            pollingStationService.recordVote(option, wallet, function (data) {
                countingData.insert({
                    timestamp: utils.timestamp(),
                    transaction: data.message,
                    option: option,
                    status: 'waiting'
                });
                setTimeout(function () {
                    var transactionRecord = countingData.find(data.message);
                    if (transactionRecord && transactionRecord.status === 'waiting') {
                        countingData.remove(data.message);
                        recordVote(option, wallet, recordVote);
                    }
                }, 10 * 60 * 1000);
            });
        }
        //call the recordVote again in case the transaction takes too long
        //or is dropped by the node
        //this will fire another recursive attempt
        recordVote(option, wallet, recordVote);
        res.status(200).json({ message: 'ok' });
    });



}
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
        
        pollingStationService.recordVote(option, wallet, function (data) {
            if (data.status) {
                countingData.insert({
                    timestamp: utils.timestamp(),
                    transaction: data.message,
                    option: option,
                    status: 'waiting'
                });
                res.status(200).json({ message: 'ok' });
            }
            else {
                res.status(422).json({ message: 'failed to record transaction' });
            }

        });

    });
}
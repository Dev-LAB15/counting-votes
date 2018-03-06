var pollingStationService = require('../services/pollingstation.service');

module.exports = function (app) {
    app.post('/counting/vote', function (req, res) {
        var wallet = req.user.wallet;
        var option = req.option;
        pollingStationService.recordVote(option, wallet, function(err, data){
            //there is no wait for record vote
            //the transaction will take place 
            //need to setup the buffer in this place
        });
        res.status(200).json({ message: 'ok' });
    });
}
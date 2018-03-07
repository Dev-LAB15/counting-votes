let pollingstationService = require('../services/pollingstation.service');
let pollingStationContract = require('../contracts/polling.station.contract');


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
                    res.status(503).json();
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error.' });
        }

    });

}
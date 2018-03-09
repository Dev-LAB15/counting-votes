var util = require('../common/utils');
var keccak256 = require('js-sha3').keccak256;
var pollingstationService = require('../services/pollingstation.service');
var pollingStationContract = require('../contracts/polling.station.contract');



module.exports = function (app) {
    //Registers a Scanned QR Code or Manually Inputed QR Code
    app.post('/scan/qrcode', function (req, res) {
        try {
            var wallet = req.user.wallet;
            var hashedCode = keccak256(req.body.code);
            hashedCode = `0x${hashedCode}`;
            pollingstationService.recordVoter(wallet, hashedCode.valueOf(), 1, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    });
    //Registers a written power of attorney
    app.post('/scan/powerofattorney', function (req, res) {
        try {
            var wallet = req.user.wallet;
            //personal power of attorney
            var hashedCode;
            var powerOfAttorneyType = 3;
            if (req.body.code) {
                //written power of attorney from a polling card
                hashedCode = req.body.code;
                powerOfAttorneyType = 2;
            }
            else {
                hashedCode = `POWEROFATTORNEY${util.timestamp()}`;
            }

            hashedCode = keccak256(hashedCode);
            hashedCode = `0x${hashedCode}`;
            pollingstationService.recordVoter(wallet, hashedCode, powerOfAttorneyType, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    //Registers a voter's pass
    app.post('/scan/voterspass', function (req, res) {
        try {
            var wallet = req.user.wallet;
            var hashedCode = `VOTERPASS${util.timestamp()}`;
            hashedCode = keccak256(hashedCode);
            hashedCode = `0x${hashedCode}`;

            pollingstationService.recordVoter(wallet, hashedCode, 4, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    //Registers an objection to the pilot
    app.post('/scan/objection', function (req, res) {
        try {
            var wallet = req.user.wallet;
            var hashedCode = `OBJECTION${util.timestamp()}`;
            hashedCode = keccak256(hashedCode);
            hashedCode = `0x${hashedCode}`;
            pollingstationService.recordVoter(wallet, hashedCode, 5, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    app.get('/scan/transactions', function (req, res) {
        pollingStationContract.setTrigger('VoterAlreadyRecorded', function (e, r) {
            console.log(e);
            console.log(r);
        });
        pollingStationContract.setTrigger('VoterCleared', function (e, r) {
            console.log(e);
            console.log(r);
        });
    })
}
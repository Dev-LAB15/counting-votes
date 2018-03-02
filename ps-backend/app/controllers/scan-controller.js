let pollingstationService = require('../services/pollingstation.service');
var keccak256 = require('js-sha3').keccak256;
let pollingStationContract = require('../contracts/polling.station.contract');



module.exports = function(app){
    //Registers a Scanned QR Code or Manually Inputed QR Code
    app.post('/scan/qrcode', function (req, res) {
        try{
            var hashedCode = keccak256(req.body.code);
            pollingstationService.recordVoter(hashedCode, 1, function(err, data){
                if(data){
                    res.send('Ok');
                } else {
                    res.status(422).json({ message: 'QR Code Already Scanned!' });
                }
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    });
    //Registers a power of attorney
    app.post('/scan/powerofattorney', function (req, res) {
        try{
            pollingstationService.recordVoter(null, 2, function(err, data){
                if(data){
                    res.send('Ok');
                } else {
                    res.status(422).json({ message: 'Failed to register Power of Attorney!' });
                }
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    //Registers a voter's pass
    app.post('/scan/voterspass', function (req, res) {
        try{
            pollingstationService.recordVoter(null, 3, function(err, data){
                if(data){
                    res.send('Ok');
                } else {
                    res.status(422).json({ message: "Failed to register Voter's Pass!" });
                }
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    //Registers an objection to the pilot
    app.post('/scan/objection', function(req, res){
        try{
            pollingstationService.recordVoter(null, 4, function(err, data){
                if(data){
                    res.send('Ok');
                } else {
                    res.status(422).json({ message: "Failed to register Objection!" });
                }
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    app.get('/scan/transactions', function(req, res) {
        pollingStationContract.setTrigger('VoterAlreadyRecorded', function(e, r) {
            console.log(e);
            console.log(r);
        });
        pollingStationContract.setTrigger('VoterCleared', function(e, r) {
            console.log(e);
            console.log(r);
        });
    })
}
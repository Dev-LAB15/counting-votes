let pollingstationService = require('../services/pollingstation.service');

module.exports = function(app){
    //Registers a Scanned QR Code or Manually Inputed QR Code
    app.post('/scan/qrcode', function (req, res) {
        try{
            pollingstationService.recordVoter(req.body.code, 1, function(err, data){
                if(data){
                    res.send('Ok');
                }else{
                    res.status(422).json({message: 'QR Code Already Scanned!'});
                }
            });
            
        }catch(err){
            res.status(500).json({message: 'Internal Server Error'});
        }
        
    });
    //Registers a power of attorney
    app.post('/scan/powerofattorney', function (req, res) {
        try{
            pollingstationService.recordVoter(req.body.code, 2, function(err, data){
                if(data){
                    res.send('Ok');
                }else{
                    res.status(422).json({message: 'Failed to register Power of Attorney!'});
                }
            });
            
        }catch(err){
            res.status(500).json({message: 'Internal Server Error'});
        }
    });
    //Registers a voter's pass
    app.post('/scan/voterspass', function (req, res) {
        try{
            pollingstationService.recordVoter(req.body.code, 3, function(err, data){
                if(data){
                    res.send('Ok');
                }else{
                    res.status(422).json({message: "Failed to register Voter's Pass!"});
                }
            });
            
        }catch(err){
            res.status(500).json({message: 'Internal Server Error'});
        }
    });
    //Registers an objection to the pilot
    app.post('/scan/objection', function(req, res){
        try{
            pollingstationService.recordVoter(req.body.code, 4, function(err, data){
                if(data){
                    res.send('Ok');
                }else{
                    res.status(422).json({message: "Failed to register Objection!"});
                }
            });
            
        }catch(err){
            res.status(500).json({message: 'Internal Server Error'});
        }
    })
}
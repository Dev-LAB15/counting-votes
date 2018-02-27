var qrcodes = require('../data/qrcode.data');


module.exports = function(app){
    //Registers a Scanned QR Code or Manually Inputed QR Code
    app.post('/scan/qrcode', function (req, res) {
        try{
            qrcodes.save(req.body.code);
            res.send('Ok');
        }catch(err){
            res.status(422).json({message: 'QR Code Already Scanned!'});
        }
        
    });
    //Registers a power of attorney
    app.post('/scan/powerofattorney', function (req, res) {
        var type = req.body.type;
        //register type on bc
        res.send('Ok');
    });
    //Registers a voter's pass
    app.post('/scan/voterspass', function (req, res) {
        res.send('Ok');
    });
    //Registers an objection to the pilot
    app.post('/scan/objection', function(req, res){
        res.send('Ok');
    })
}
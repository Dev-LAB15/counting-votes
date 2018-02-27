var qrcodes = require('../data/qrcode.data');


module.exports = function(app){
    
    app.appRouter.post('/scan/qrcode', function (req, res) {
        try{
            qrcodes.save(req.code);
            res.send('Ok');
        }catch(err){
            res.status(422).json({message: 'QR Code Already Scanned!'});
        }
        
    });
    
    app.appRouter.post('/scan/powerofattorney', function (req, res) {
        res.send('Ok');
    });
    
    app.appRouter.post('/scan/voterspass', function (req, res) {
        res.send('Ok');
    });
}
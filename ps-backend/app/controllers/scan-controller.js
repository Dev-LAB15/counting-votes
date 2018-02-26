
module.exports = function(app){
    
    app.appRouter.post('/scan/qrcode', function (req, res) {
        res.send('Ok');
    });
    
    app.appRouter.post('/scan/powerofattorney', function (req, res) {
        res.send('Ok');
    });
    
    app.appRouter.post('/scan/voterspass', function (req, res) {
        res.send('Ok');
    });
}
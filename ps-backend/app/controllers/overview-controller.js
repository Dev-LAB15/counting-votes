var pollingStationContract = require('../contracts/polling.station.contract');

module.exports = function(app){
    app.get('/overview/report', function(req, res){
        pollingStationContract.getReport(function(err, response){

            console.log(response);

            res.json(response);
        });
    });
}
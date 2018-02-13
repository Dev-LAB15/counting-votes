var utils = require('../common/utils');
module.exports = function (app) {
    app.get('/', function (req, res) {
        var code = utils.generateCode();
        res.send("Counting Votes Endpoint");
    });
}
var loki = require('lokijs');
var db = new loki('verification.codes.json');
var data = db.addCollection('verification_code', {indices: ['email']});
module.exports.data = data;
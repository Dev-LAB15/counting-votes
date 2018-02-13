var loki = require('lokijs');

var db = new loki('users.json');
var data = db.addCollection('users', {indices: ['email']});

data.insert({name: 'Moises', email: 'moises@lab15.io', password: 'd033e22ae348aeb5660fc2140aec35850c4da997'});

module.exports.data = data;
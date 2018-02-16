var loki = require('lokijs');

var db = new loki('users.json');
var data = db.addCollection('users', {indices: ['email']});

data.insert({name: 'Moises', email: 'moises@lab15.io'});

module.exports.data = data;

module.exports.find = function(email){
    var results = data.find(({'email': email}));
    if(results.length > 0)
        return results[0];
    return null;
}

module.exports.update = function(user){
    data.update(user);
}
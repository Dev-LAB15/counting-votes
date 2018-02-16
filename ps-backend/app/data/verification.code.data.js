var loki = require('lokijs');
var utils = require('../common/utils');
var db = new loki('verification.codes.json');
var data = db.addCollection('verification_code', {indices: ['email']});

module.exports.save = function(vcode){
    data.insert(vcode);
}

module.exports.markUsed =function(vcode){
    vcode.used = true;
    data.update(vcode);
}



module.exports.find = function(email){
    var results = data.chain()
        .where(function(obj){ 
            return obj.email === email && !obj.used 
        })
        .simplesort('timestamp', true)
        .data();
    if(results.length > 0)
        return results[0];
    return null;
}
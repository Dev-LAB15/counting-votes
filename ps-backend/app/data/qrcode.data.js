var utils = require('../common/utils');
var loki = require('lokijs');
var db = new loki('users.json');
var data = db.addCollection('qrcode', {indices: ['code', 'timestamp']});

/**
 * Saves a scanned QR Code
 * @param { code: '', timestamp: # } qrcode 
 */
module.exports.save = function(code){
    if(!this.find(code)){
        var qrcode = {
            code: code,
            timestamp: utils.timestamp()
        }
        data.insert(qrcode);
    }
    else{
        throw 422;
    }
    
}
/**
 * Queries if the qrcode is already registered
 * @param {*} code 
 */
module.exports.find = function(code){
    var results = data.chain()
        .where(function(obj){ 
            return obj.code === code && !obj.used 
        })
        .simplesort('timestamp', true)
        .data();
    if(results.length > 0)
        return results[0];
    return null;
}
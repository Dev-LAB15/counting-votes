var loki = require('lokijs');
var data = db.addCollection('qrcode', {indices: ['code']});

/**
 * Saves a scanned QR Code
 * @param { code: '', timestamp: # } qrcode 
 */
module.exports.save = function(qrcode){
    data.insert(qrcode);
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
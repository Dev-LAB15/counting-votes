var utils = require('../common/utils');
var loki = require('lokijs');
var db = new loki('users.json');
var data = db.addCollection('qrcode', { indices: ['code', 'timestamp'] });
var bcservice = require('./blockchain.data');

/**
 * Saves a scanned QR Code
 * @param { code: '', timestamp: # } qrcode 
 */
module.exports.save = function (code) {
    if (!this.find(code)) {
        var qrcode = {
            code: code,
            timestamp: utils.timestamp()
        }
        data.insert(qrcode);
        bcservice.recordVoter(code, {
            address: '0x5b29a9a7543b364a4b9cf5b978358f65c80cf442',
            privateKey: 'a4034aac32913768e99ec80e5c4e2e99c63e9e090f5fcc97ba1f311141163959'
        }, function (data) {
            console.log(data);
        })
    } else {
        throw 422;
    }
}
/**
 * Queries if the qrcode is already registered
 * @param {*} code 
 */
module.exports.find = function (code) {
    var results = data.chain()
        .where(function (obj) {
            return obj.code === code && !obj.used
        })
        .simplesort('timestamp', true)
        .data();
    if (results.length > 0)
        return results[0];
    return null;
}
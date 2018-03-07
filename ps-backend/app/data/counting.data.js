var utils = require('../common/utils');
var config = require('../../config.json');
var loki = require('lokijs');
var db = new loki('counting.json');
var data = db.addCollection('countings', { indices: ['transaction'] });
/**
 * Inserts a vote transaction
 * @param {any} voteTransaction 
 */
module.exports.insert = function (voteTransaction) {
    data.insert(voteTransaction);
}
/**
 * Updates a vote transaction based on the block aware logic.
 * @param {string} transaction 
 * @param {string} status 
 */
module.exports.update = function (transaction, status, signature) {
    var results = data.find(({ 'transaction': transaction }));
    if (results.length > 0) {
        results[0].updatedTimestamp = utils.timestamp();
        results[0].status = status;
        results[0].signature = signature;
        data.update(results[0]);
    }
}
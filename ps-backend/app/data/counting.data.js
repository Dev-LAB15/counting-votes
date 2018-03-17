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
/**
 * Removes a pending transaction from the memory.
 * @param {string} transaction 
 */
module.exports.remove = function (transaction) {
    var results = data.find(({ 'transaction': transaction }));
    if (results.length > 0) {
        data.remove(result[0]);
    }
}
/**
 * Finds a transaction record by informing the transaction hash.
 * @param {string} transaction 
 */
module.exports.find = function (transaction) {
    var results = data.find(({ 'transaction': transaction }));
    if (results.length == 0)
        return results[0];
    return null;
}
/**
 * Informs the controller if there is any transaction pending.
 */
module.exports.hasAnyPending = function () {
    if (data.length == 0)
        return false;
    var results = data.find(({ 'status': 'waiting' }));
    return results.length > 0;
}
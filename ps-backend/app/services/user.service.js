var config = require('../../config.json');
var contract = require('../contracts/user.activation.contract');

/**
 * Requests the role of an user or if the user is registered on the block.
 * 0 user is not authorized
 * 1 user is owner
 * 2 user is mayor
 * 3 user is chairman
 * 4 user is teller
 * @param {email address of the user} email 
 * @param {A callback function (err, data) to be called after the transaction is complete} callback 
 */
exports.getRoleId = function (email, callback) {
    contract.getRoleId(email, callback);
}

exports.getUsedEmail = function(email, callback){
    contract.getUsedEmail(email, callback);
}
/** 
 * Base Service for Blockchain Operations.
 * All other Services must inherit this base service. 
*/
var web3raw = require('web3js-raw');
var config = require('../../config.json');

var W3JSR = new web3raw();
W3JSR.setProvider(config.blockchain.provider);

/**
 * 
 * @param {A combination of address and privateKey} userData 
 * @param {Address for the base operations} contractAddress 
 * @param {ASCI name of the funcion to be called from the contract} functionName 
 * @param {Array containing a key-pair of type and value} params 
 * @param {A funcion to be executed after the transaction has been processed} callback 
 */
module.exports.executeFunction = function (userData, contractAddress, functionName, params, callback) {

    var privateKey = new Buffer(userData.privateKey, 'hex');
    var types = [];
    var args = [];

    for (var i = 0; i < params.length; i++) {
        types.push(params[i].type);
        args.push(params[i].value);
    }

    var txnData = W3JSR.encodeFunctionParams(functionName, types, args);
    var txnRawData = W3JSR.getDefaultTxnAttributes('', userData.address, contractAddress, '0', txnData, '', '');
    var serializedTx = W3JSR.getSignedTransaction(txnRawData, privateKey);

    W3JSR.invokeSendRawTransaction(functionName, serializedTx, callback);
}

module.exports.toAscii = function (hex) {
    // Find termination
    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        var code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }

    return str;
};
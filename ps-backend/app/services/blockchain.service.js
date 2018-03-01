var web3raw = require('web3js-raw');
var config = require('../../config.json');
var W3JSR = new web3raw();

W3JSR.setProvider(config.blockchain.provider);
/**
 * Executes a raw transaction on the block.
 * @param {{address:string,privateKey:string}} userData 
 * @param {string} contractAddress 
 * @param {string} functionName 
 * @param {Array} params 
 * @param {function({status:number,functionName:string,message:string})} callback 
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
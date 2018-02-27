var web3raw = require('web3js-raw');
var config = require('../../config.json');

var W3JSR = new web3raw();
W3JSR.setProvider(config.blockchain.provider);

module.exports.recordVoter = function(code, userData, callback) {
    this.executeFunction('recordVoter', userData, config.addresses.polling, [
        { type: 'bytes32', value: code },
        { type: 'int', value: 0 }
    ], callback || function(data) {
        console.log(data);
    });
}

module.exports.executeFunction = function(functionName, userData, contractAddress, params, callback) {

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
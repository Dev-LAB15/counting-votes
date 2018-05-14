/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
 
var web3raw = require('web3js-raw');
var config = require('../../config.json');
/**
 * Executes a raw transaction on the block.
 * @param {{address:string,privateKey:string}} userData 
 * @param {string} contractAddress 
 * @param {string} functionName 
 * @param {Array} params 
 * @param {function({status:number,functionName:string,message:string})} callback 
 * @param {string} valueInEther
 */

module.exports.executeFunction = function (userData, contractAddress, functionName, params, callback, valueInEther) {
    //avoid leak
    var W3JSR = new web3raw();
    W3JSR.setProvider(config.blockchain.httpProvider);
    var privateKey = new Buffer(userData.privateKey, 'hex');
    var types = [];
    var args = [];

    valueInEther = valueInEther || '0'

    for (var i = 0; i < params.length; i++) {
        types.push(params[i].type);
        args.push(params[i].value);
    }

    var txnData = W3JSR.encodeFunctionParams(functionName, types, args);
    var txnRawData = W3JSR.getDefaultTxnAttributes('', userData.address, contractAddress, valueInEther, txnData, '', '');
    var serializedTx = W3JSR.getSignedTransaction(txnRawData, privateKey);

    W3JSR.invokeSendRawTransaction(functionName, serializedTx, callback);
}
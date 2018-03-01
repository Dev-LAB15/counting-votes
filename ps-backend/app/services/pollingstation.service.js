let contract = require('../contracts/polling.station.contract');

/**
 * Records a QR Code, a Voter Pass, a Power of Attorney or an Oposition to the Pilot.
 * @param {string} qrCodeHash 
 * @param {number} voterType 
 * @param {{function(any, any)}} callback
 */
module.exports.recordVoter = function (qrCodeHash, voterType, callback) {
    contract.recordVoter(qrCodeHash, voterType, callback);
}
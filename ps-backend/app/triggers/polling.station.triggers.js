module.exports = function () {
    let contract = require('../contracts/polling.station.contract');
    contract.setTrigger('allEvents', function (err, result) {
        console.log('pollingstation.sol trigger raised');
        console.log(result);
    });

    contract.setTrigger('VerificationAttempt', function (err, result) {
        console.log('VerificationAttempt trigger raised');
        console.log(result);
    });
}
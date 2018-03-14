module.exports = function () {
    let contract = require('../contracts/polling.station.contract');
    contract.setTrigger('allEvents', function (err, result) {
        console.log('pollingstation.sol trigger raised');
        if (err) {
            console.log(err.reason);
            return;
        }
        if (result)
            console.log(result);
    });
}
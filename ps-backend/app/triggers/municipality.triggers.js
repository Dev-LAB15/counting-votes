module.exports = function () {
    let contract = require('../contracts/municipality.contract');
    contract.setTrigger('allEvents', function (err, result) {
        console.log('municipality.sol trigger raised');
        console.log(result);
    });
}
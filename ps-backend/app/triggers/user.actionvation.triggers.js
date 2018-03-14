module.exports = function () {
    let contract = require('../contracts/user.activation.contract');
    contract.setTrigger('allEvents', function (err, result) {
        console.log('useractivation.sol trigger raised');
        if (err) {
            console.log(err.reason);
            return;
        }
        console.log(result);
    });
}
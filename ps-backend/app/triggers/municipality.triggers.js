var countingData = require('../data/counting.data');
module.exports = function () {
    let contract = require('../contracts/municipality.contract');

    /**
     * This trigger is mainly used to confirm the vote confirmation
     * from the block.
     */
    contract.setTrigger('allEvents', function (err, result) {

        console.log('municipality.sol trigger raised');
        if(err){
            console.log(err.reason);
            return;
        }
        console.log(result);
        var events = ['YesVoted', 'NoVoted', 'InvalidVoted', 'BlankVoted'];
        try {
            if (events.indexOf(result.event) >= 0) {
                countingData.update(result.transactionHash, 'confirmed', result.signature);
            }
        } catch (err) {

        }
    });
}
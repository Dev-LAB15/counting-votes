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
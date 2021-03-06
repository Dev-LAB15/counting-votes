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
var pollingStationContract = require('../contracts/polling.station.contract');

module.exports = function (app) {
    app.get('/overview/report', function (req, res) {
        pollingStationContract.getReport(function (err, response) {
            console.log(response);
            res.json(response);
        });
    });
}
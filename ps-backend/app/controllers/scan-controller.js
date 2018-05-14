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
var util = require('../common/utils');
var keccak256 = require('js-sha3').keccak256;
var pollingstationService = require('../services/pollingstation.service');
var mnContract = require('../contracts/municipality.contract');


module.exports = function (app) {
    //Registers a Scanned QR Code or Manually Inputed QR Code
    app.post('/scan/qrcode', function (req, res) {
        try {

            var code = req.body.code;
            if (!code) {
                code = req.body.qrcode;
            }

            var hashedCode = keccak256(code);
            var wallet = req.user.wallet;
            hashedCode = `0x${hashedCode}`;
            mnContract.getVoterClearedEvents(function (error, result) {
                if (result && result instanceof Array && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].returnValues && result[i].returnValues.qrCodeHash) {
                            if (hashedCode === result[i].returnValues.qrCodeHash) {
                                try {
                                    res.status(422).json({ message: 'Polling card already registered!' });
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                }
                //always record
                pollingstationService.recordVoter(wallet, hashedCode.valueOf(), 1, function (result) {

                    try {
                        if (result.status) {
                            res.send('OK');
                        }
                        else {
                            res.status(422).json({ message: result.message.message });
                        }

                    } catch (err) {
                        console.log(err);
                    }


                });
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    });
    //Registers a written power of attorney
    app.post('/scan/powerofattorney', function (req, res) {
        try {
            var wallet = req.user.wallet;
            //personal power of attorney
            var hashedCode;
            var powerOfAttorneyType = 3;
            if (req.body.code) {
                //written power of attorney from a polling card
                hashedCode = req.body.code;
                powerOfAttorneyType = 2;
            }
            else {
                hashedCode = `POWEROFATTORNEY${util.timestamp()}`;
            }

            hashedCode = keccak256(hashedCode);
            hashedCode = `0x${hashedCode}`;
            pollingstationService.recordVoter(wallet, hashedCode, powerOfAttorneyType, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    //Registers a voter's pass
    app.post('/scan/voterspass', function (req, res) {
        try {
            var wallet = req.user.wallet;
            var hashedCode = `VOTERPASS${util.timestamp()}`;
            hashedCode = keccak256(hashedCode);
            hashedCode = `0x${hashedCode}`;

            pollingstationService.recordVoter(wallet, hashedCode, 4, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    //Registers an objection to the pilot
    app.post('/scan/objection', function (req, res) {
        try {
            var wallet = req.user.wallet;
            var hashedCode = `OBJECTION${util.timestamp()}`;
            hashedCode = keccak256(hashedCode);
            hashedCode = `0x${hashedCode}`;
            pollingstationService.recordVoter(wallet, hashedCode, 5, function (result) {
                res.send('OK');
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
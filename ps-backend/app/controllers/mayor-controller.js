var config = require('../../config.json');
var utils = require('../common/utils');
var userService = require('../services/user.service');
var municipalityService = require('../services/municipality.service');

module.exports = function (app) {
    /**
     * Creates the password for the mayor.
     */
    app.post('/mayor/createpassword', function (req, res) {
        var usr = userService.getRoleId(req.body.email, function (err, roleId) {
            //only the mayor can create it's own password
            if (roleId != "2") {
                res.status(403).json({ message: 'Invalid credentials' });
                return;
            }
            userService.getUsedEmail(req.body.email, function (err, active) {
                if (active) {
                    res.status(422).json({
                        message: 'Account already activated'
                    });

                }
                else {
                    if (!userService.validateVerificationCode(req.body.email, req.body.code)) {
                        res.status(422).json({
                            message: "Invalid Verification Code"
                        });
                        return;
                    }

                    if (!req.body.password || req.body.password.length === 0) {
                        res.status(422).json({
                            message: "Please inform a password"
                        });
                        return;
                    }

                    if (!req.body.passwordConfirmation || req.body.passwordConfirmation.length === 0) {
                        res.status(422).json({
                            message: "Please inform a password confirmation"
                        });
                        return;
                    }

                    var getMayorSignedInEvent = function (receipt) {
                        municipalityService.getMayorSignedInEvent(function (err, userSignedInEvent) {
                            var signedInConfirmed = false;
                            if (userSignedInEvent && userSignedInEvent instanceof Array && userSignedInEvent.length > 0) {
                                for (let i = 0; i < userSignedInEvent.length; i++) {
                                    if (userSignedInEvent[i].transactionHash == receipt) {
                                        signedInConfirmed = true;
                                    }
                                }
                            }
                            if (!signedInConfirmed) {
                                getMayorSignedInEvent(receipt);
                            } else {
                                var user = {
                                    email: req.body.email,
                                    wallet: {
                                        address: wallet.address,
                                        privateKey: wallet.privateKey
                                    }
                                }
                                var token = app.jwt.sign(user, config.secret, { expiresIn: "14 days" });
                                res.json({
                                    success: true,
                                    user: user.email,
                                    token: token
                                });
                            }
                        });
                    }

                    var getUserAddedEvent = function (receipt) {
                        municipalityService.getUserAddedEvent(function (err, userAddedEvent) {
                            let confirmed = false;
                            if (userAddedEvent && userAddedEvent instanceof Array && userAddedEvent.length > 0) {
                                for (var i = 0; i < userAddedEvent.length; i++) {
                                    let event = userAddedEvent[i];
                                    if (event.transactionHash === receipt) {
                                        confirmed = true;
                                    }
                                }
                            }
                            if (!confirmed) {
                                getUserAddedEvent(receipt);
                            }
                            else {
                                municipalityService.mayorSignIn(wallet, function (signInReceipt) {
                                    getMayorSignedInEvent(signInReceipt.message);
                                });
                            }
                        });
                    }

                    var wallet = userService.getWallet(req.body.email, req.body.password);
                    municipalityService.setMayorRole(req.body.email, wallet.address, function (setUserRoleReceipt) {
                        if (!setUserRoleReceipt.status) {
                            res.status(422).json({ message: setUserRoleReceipt.message.stack });
                            return;
                        } else {
                            getUserAddedEvent(setUserRoleReceipt.message);
                        }
                    });
                }
            });
        });
    });

    /**
	 * TODO: review signin page
	 * Allows user signin by providing email, password and verification_code
	 */
    app.post('/mayor/signin', function (req, res) {
        if (!req.body.email) {
            res.status(422).json({
                message: 'Please inform an email address'
            })
        }

        if (!userService.validateVerificationCode(req.body.email, req.body.code)) {
            res.status(422).json({
                message: "Invalid Verification Code"
            });
            return;
        }

        userService.getUsedEmail(req.body.email, function (err, active) {
            if (err) {
                res.status(500).json({ message: err.message });
                return;
            }
            if (!active) {
                res.status(422).json({
                    message: "Account isn't activated yet, please consider creating a password first"
                });
                return;
            }
            else {
                var wallet = userService.getWallet(req.body.email, req.body.password);
                municipalityService.getRole(wallet, function (err, roleId) {
                    if (err) {
                        res.status(500).json({ message: err.message });
                        return;
                    }
                    if (!roleId || roleId != "2") {
                        res.status(403).json({
                            message: 'Invalid Credentials'
                        });
                    }
                    else {

                        municipalityService.mayorSignIn(wallet, function (receipt) {

                        });
                        var user = {
                            email: req.body.email,
                            wallet: {
                                address: wallet.address,
                                privateKey: wallet.privateKey
                            }
                        }
                        var token = app.jwt.sign(user, config.secret, { expiresIn: "14 days" });
                        res.json({
                            success: true,
                            user: user.email,
                            token: token
                        });
                    }
                });
            }
        });
    });

    app.get('/mayor/getsummary', function (req, res) {
        municipalityService.getSummary(function (err, summary) {
            res.json(summary);
        })
    });

    app.post('/mayor/summary', function (req, res) {
        var selection = req.body.selection;
        var pollingStation = '0';
        switch (selection) {
            case 2:
                pollingStation = "003";
                break;
            case 3:
                pollingStation = "011";
                break;
            case 4:
                pollingStation = "016";
                break;
            case 5:
                pollingStation = "004";
                break;
            case 6:
                pollingStation = "134";
                break;
            default:
                pollingStation = '0';
                break;
        }
        municipalityService.querySummary(pollingStation, function (err, summary) {
            res.json(summary);
        });
    });


    app.get('/mayor/cansignoff', function (req, res) {
        municipalityService.canSignOff(function (err, canSignOffResult) {
            if (err) {
                res.status(500).json({ message: err });
                return;
            }
            if (canSignOffResult) {
                res.json({ message: 'ok' });
            }
            else {
                res.status(422).json({ message: "can't sign off!" });
            }
        });
    });

    app.get('/mayor/signoff', function (req, res) {
        var email = req.user.email;
        var password = req.body.password;
        var wallet = userService.getWallet(email, password);

        municipalityService.signOff(wallet, function (signOffStatus) {
            if (signOffStatus.status) {
                res.json({ message: 'ok' });
            }
            else {
                res.status(422).json({ message: signOffStatus.message });
            }
        });
    });
}
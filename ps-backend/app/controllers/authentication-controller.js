var ethwallet = require('ethereumjs-wallet');
var config = require('../../config.json');
var mailService = require('../common/mail.service');
var sha1 = require('sha1');
var utils = require('../common/utils');
var users = require('../data/user.data');
var userService = require('../services/user.service');
var pollingStationService = require('../services/pollingstation.service');
var pollingStationContract = require('../contracts/polling.station.contract');
var vcodes = require('../data/verification.code.data');

module.exports = function (app) {

	/**
	 * Requests a Verification Code for the user.
	 * @param {string} email 
	 * @param {string} code 
	 */
	function validateVerificationCode(email, code) {
		if (app.config.useVerificationCode) {
			try {
				var vcode = vcodes.find(email);
				var isValidCode = vcode && vcode.code == code;
				if (isValidCode) {
					vcodes.markUsed(vcode);
				}
				return isValidCode;
			} catch (err) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Generates a verification code for signin process.
	 * TODO: request ledger registry to confirm user password creation.
	 * TODO: remove LokiJS and add blockchain signin.
	 */
	app.post('/authentication/verification', function (req, res) {
		if (!req.body.email || req.body.email == '') {
			res.status(422).json({ message: "Email can't be empty" });
			return;
		}
		userService.getUsedEmail(req.body.email, function (err, active) {
			if (err) {
				res.status(500).json({ message: err.message });
				return;
			}
			userService.getRoleId(req.body.email, function (err, roleId) {
				if (err) {
					res.status(500).json({ message: err.message });
					return;
				}
				if (!roleId || roleId == "0") {
					res.status(403).json({ message: 'Unauthorized access' });
					return;
				}

				if (roleId != req.body.role) {
					res.status(403).json({ message: 'Invalid role or assignment' });
					return;
				}
				var code = utils.generateCode();
				var vcode = {
					code: code,
					timestamp: utils.timestamp(),
					email: req.body.email
				}
				vcodes.save(vcode);
				if (app.config.useVerificationCode) {
					mailService.sendVerificationCode(req.body.email, "", code);
				}
				res.json({ message: 'Please check your email address to get the verification code', isActive: active });
			});
		});
	});

	/**
	 * Generates user password.
	 */
	app.post('/authentication/createpassword', function (req, res) {
		//anyone can search if the user exists on the block
		var usr = userService.getRoleId(req.body.email, function (err, roleId) {
			if (roleId == "0") {
				res.status(403).json({ message: 'Invalid credentials' });
			}
			else {
				userService.getUsedEmail(req.body.email, function (err, active) {
					if (active) {
						res.status(422).json({
							message: 'Account already activated'
						});
					}
					else {
						if (!validateVerificationCode(req.body.email, req.body.code)) {
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

						var getSignedInEvent = function (receipt) {
							pollingStationService.getSignedInEvent(function (err, userSignedInEvent) {
								var signedInConfirmed = false;
								if (userSignedInEvent && userSignedInEvent instanceof Array && userSignedInEvent.length > 0) {
									for (let i = 0; i < userSignedInEvent.length; i++) {
										if (userSignedInEvent[i].transactionHash == receipt) {
											signedInConfirmed = true;
										}
									}
								}
								if (!signedInConfirmed) {
									getSignedInEvent(receipt);
								} else {
									var user = {
										email: req.body.email,
										wallet: {
											address: wallet.address,
											privateKey: wallet.privateKey
										}
									}
									var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
									res.json({
										success: true,
										user: user.email,
										token: token
									});
								}
							});
						}

						var getVotingSessionBeganEvent = function (receipt) {
							pollingStationService.getVotingSessionBeganEvent(function (err, votingSessionBeganEvent) {
								if (votingSessionBeganEvent && votingSessionBeganEvent instanceof Array && votingSessionBeganEvent.length > 0) {
									pollingStationService.signIn(wallet, function (signInReceipt) {
										getSignedInEvent(signInReceipt.message);
									});
								}
								else {
									getVotingSessionBeganEvent();
								}
							});
						}

						var getUserAddedEvent = function (receipt) {
							pollingStationService.getUserAddedEvent(function (err, userAddedEvent) {
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
									if (req.body.role == '3') {
										pollingStationService.beginVotingSession(function (beginVotingSessionReceipt) {
											getVotingSessionBeganEvent(beginVotingSessionReceipt.message);
										});
									} else {
										pollingStationService.signIn(wallet, function (signInReceipt) {
											getSignedInEvent(signInReceipt.message);
										});
									}
								}
							});
						}

						var wallet = userService.getWallet(req.body.email, req.body.password);
						userService.setUserRole(req.body.email, wallet.address, function (setUserRoleReceipt) {
							if (!setUserRoleReceipt.status) {
								res.status(422).json({ message: setUserRoleReceipt.message.stack });
								return;
							} else {
								getUserAddedEvent(setUserRoleReceipt.message);
							}
						});
					}
				});
			}
		});
	});

	/**
	 * TODO: review signin page
	 * Allows user signin by providing email, password and verification_code
	 */
	app.post('/authentication/signin', function (req, res) {


		if (!req.body.email) {
			res.status(422).json({
				message: 'Please inform an email address'
			})
		}

		if (!validateVerificationCode(req.body.email, req.body.code)) {
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

				pollingStationService.signIn(wallet, function (receipt) {

				});

				userService.getRole(wallet, function (err, roleId) {
					if (err) {
						res.status(500).json({ message: err.message });
						return;
					}
					if (!roleId || roleId == "0") {
						res.status(403).json({
							message: 'Invalid Credentials'
						});
					}
					else {
						var user = {
							email: req.body.email,
							wallet: {
								address: wallet.address,
								privateKey: wallet.privateKey
							}
						}
						var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
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

	app.post('/authentication/signofftest', function (req, res) {
		if (!req.body.email) {
			res.status(422).json({
				message: 'Please inform an email address'
			})
			return;
		}
		if (!req.body.password) {
			res.status(422).json({
				message: 'Please inform an email address'
			})
			return;
		}
		res.json({ message: 'ok' });
	});

	/**
	 * TODO: review signin page
	 * Allows user signin by providing email, password and verification_code
	 */
	app.post('/authentication/signoff', function (req, res) {
		var explanation = req.body.explanation || "";
		if (!req.body.email) {
			res.status(422).json({
				message: 'Please inform an email address'
			})
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
				userService.getRole(wallet, function (err, roleId) {
					if (err) {
						res.status(500).json({ message: err.message });
						return;
					}
					if (!roleId || roleId == "0") {
						res.status(403).json({
							message: 'Invalid Credentials'
						});
					}
					else {

						var getSignedOffEvent = function (receipt) {
							pollingStationService.getSignedOffEvent(function (error, signedOffEvents) {
								var confirmed = false;
								var result = null;
								if (signedOffEvents && signedOffEvents instanceof Array && signedOffEvents.length > 0) {
									for (let i = 0; i < signedOffEvents.length; i++) {
										if (signedOffEvents[i].transactionHash == receipt) {
											confirmed = true;
											result = signedOffEvents[i];
										}
									}
								}
								if (!confirmed) {
									getSignedOffEvent(receipt);
								}
								else {
									if (result.returnValues.success) {
										res.send(result.returnValues);
									} else {
										res.status(422).json({ message: result.returnValues.message });
									}
								}
							});
						}

						pollingStationService.signOff(wallet, explanation, function (signOffReceipt) {
							if (signOffReceipt.status) {
								getSignedOffEvent(signOffReceipt.message);
							}
							else {
								res.status(422).json({ message: signOffReceipt.message });
							}
						});
					}
				});
			}
		});
	});

	/**
	 * Submit to finish the voting session.
	 */
	app.get('/authentication/submit', function (req, res) {
		pollingStationService.canSubmit(function (err, result) {
			if (result) {
				res.send('ok');
			} else {
				res.status(422).json({ message: 'All members must sign off in order to finish the voting session.' });
			}
		});
	});

	/**
	 * Performs a signoff check 
	 */
	app.get('/authentication/signoffcheck', function (req, res) {
		pollingStationContract.getPastEvents(function (err, events) {
			//the voter events can't exceed a maximum value of 10
			var signEvents = [];
			for (let i = 0; i < events.length; i++) {
				let event = events[i];
				switch (event.event) {
					case "StaffSignedOff":
						signEvents.push({ transactionHash: event.transactionHash, error: false });
						break;
					case "VotingFinished":
						signEvents.push({ transactionHash: event.transactionHash, error: false });
						break;
					default:
						break;
				}
			}
			//reverses the array
			signEvents.reverse();
			res.json(signEvents);
		});
	});

	/**
	 * Executes the signout process
	 */
	app.get('/authentication/signout', function (req, res) {

		res.send({ ok: "ok" });
	});


}
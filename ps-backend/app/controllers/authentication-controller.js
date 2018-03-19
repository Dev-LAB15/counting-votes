var config = require('../../config.json');
var utils = require('../common/utils');
var userService = require('../services/user.service');
var pollingStationService = require('../services/pollingstation.service');

module.exports = function (app) {

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
									var token = app.jwt.sign(user, config.secret, { expiresIn: "14 days" });
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
	 * Executes the signout process
	 */
	app.post('/authentication/signout', function (req, res) {
		var timeoutStart = utils.timestamp();
		var wallet = userService.getWallet(req.body.email, req.body.password);

		var getUserSignedOutEvent = function (transactionHash) {
			pollingStationService.getUserSignedOutEvent(function (err, userSignedOutEvents) {
				var timeout = utils.timestamp() - timeoutStart;
				if (timeout > 30 * 1000) {
					res.json({ message: 'Request timeout ' });
					return;
				}

				var signOutSuccess = false;
				if (userSignedOutEvents && userSignedOutEvents instanceof Array && userSignedOutEvents.length > 0) {
					for (var i = 0; i < userSignedOutEvents.length; i++) {
						if (userSignedOutEvents[i].transactionHash == transactionHash)
							signOutSuccess = true;
					}
				}

				if (signOutSuccess) {
					res.json({ message: 'Sign out ok' });
				} else {
					getUserSignedOutEvent(transactionHash);
				}
			});
		}

		userService.signOut(wallet, function (signOutResult) {
			if (signOutResult.status)
				getUserSignedOutEvent(signOutResult.message);
			else
				res.status(422).json({ message: 'Failed to sign out' });
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

}
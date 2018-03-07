var ethwallet = require('ethereumjs-wallet');
var config = require('../../config.json');
var mailService = require('../common/mail.service');
var sha1 = require('sha1');
var utils = require('../common/utils');
var users = require('../data/user.data');
var userService = require('../services/user.service');
var poillingStationService = require('../services/pollingstation.service');
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
					res.status(403).json({ message: 'Invalid credentials' });
					return;
				}
				var code = utils.generateCode();
				var vcode = {
					code: code,
					timestamp: utils.timestamp(),
					email: req.body.email
				}
				vcodes.save(vcode);
				mailService.sendVerificationCode(req.body.email, "", code);
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

						var wallet = userService.getWallet(req.body.email, req.body.password);
						poillingStationService.signIn(wallet, function (receipt) {
							//the signin event is assynchronous
							//the trigger must be aware when the transaction happens
						});

						var address = wallet.address;
						//defines the user role and waits for the operation to complete.
						userService.setUserRole(req.body.email, address, function (data) {
							var user = {
								email: req.body.email,
								wallet: {
									address: wallet.address,
									privateKey: wallet.privateKey
								}
							}
							var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
							res.json({
								user: user,
								token: token
							});
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

				poillingStationService.signIn(wallet, function (receipt) {
					//the signin event is assynchronous
					//the trigger must be aware when the transaction happens
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
	/**
	 * Executes the signout process
	 */
	app.get('/authentication/signout', function (req, res) {
		res.send({ ok: "ok" });
	});
}
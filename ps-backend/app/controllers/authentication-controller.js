var ethwallet = require('ethereumjs-wallet');
var config = require('../../config.json');
var mailService = require('../common/mail.service');
var sha1 = require('sha1');
var utils = require('../common/utils');
var users = require('../data/user.data');
var userService = require('../services/user.service');
var vcodes = require('../data/verification.code.data');

module.exports = function (app) {
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

		userService.getRoleId(req.body.email, function (err, data1) {
			if (!data1 || data1 == "0") {
				res.status(403).json({ message: 'Invalid credentials' });
				return;
			}

			userService.getUsedEmail(req.body.email, function (err, data) {
				if (!data) {
					res.status(422).json({
						message: "Wallet wasn't generated"
					});
				}
				var wallet = userService.getWallet(req.body.email, req.body.password);
				var code = utils.generateCode();
				var vcode = {
					code: code,
					timestamp: utils.timestamp(),
					email: user.email
				}

				vcodes.save(vcode);
				mailService.sendVerificationCode(user.email, user.name, code);
				res.json({
					isActive: user.isActive,
					message: 'Please check your email address to get the verification code'
				});
			});
		});
	});

	/**
	 * Generates user password.
	 */
	app.post('/authentication/createpassword', function (req, res) {
		//anyone can search if the user exists on the block
		var usr = userService.getRoleId(req.body.email, function (err, data) {

			if (data == "0") {
				res.status(403).json({ message: 'Invalid credentials' });
			}
			else {
				userService.getUsedEmail(req.body.email, function (err, data) {
					if (data) {
						res.status(422).json({
							message: 'Password already defined, if you forgot it, try to recover'
						});
					}
					else {
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


						//verify if the address has ether

						// if (!code) {
						// 	res.status(422).json({
						// 		message: "You must first request an activation code"
						// 	});
						// 	return;
						// }

						// if (code.code != req.body.code) {
						// 	res.status(422).json({
						// 		message: "Invalid verification code"
						// 	});
						// 	return;
						// }

						var wallet = userService.getWallet(req.body.email, req.body.password);
						var address = wallet.address;
						var token = app.jwt.sign(user, app.config.secret, { expiresIn: config.tokenExpiration });
						res.json({
							user: user.name,
							address: address,
							token: token
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
		var user = users.find(req.body.email);
		if (!user) {
			res.status(403).json({
				message: 'Invalid Credentials'
			});
			return;
		}

		var vcode = vcodes.find(user.email);
		if (!vcode) {
			res.status(422).json({
				message: 'Please request a Verification Code First'
			})
			return;
		}

		if (vcode.code != req.body.code) {
			res.status(422).json({
				message: 'Invalid Verification Code'
			});
			return;
		}

		if (user.password == sha1(req.body.password)) {
			vcodes.markUsed(vcode);
			var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
			res.json({
				success: true,
				user: user.name,
				token: token
			});
		}
		else {
			res.status(403).json({
				message: 'Invalid Credentials'
			});
		}
	});
	/**
	 * Executes the signout process
	 */
	app.get('/authentication/signout', function (req, res) {
		res.send({ ok: "ok" });
	});
}
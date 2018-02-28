var ethwallet = require('ethereumjs-wallet');
var crypto = require('crypto');
var config = require('../../config.json');
var blockchain = require('../services/blockchain.service');
var axios = require('axios');
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

		var user = users.find(req.body.email);
		if (!user) {
			res.status(403).json({ message: 'Invalid credentials' });
			return;
		}

		if (user.role != req.body.role) {
			res.status(403).json({ message: 'Action Forbidden! Please verify your role and try again.' });
		}

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

						//generates private key for address resolution
						let passphrase = req.body.email+req.body.password;
						//generates a sha256 address
						var hash = crypto.createHmac('sha256', config.secret);
						//updates the hash containing the passphrase
						hash.update(passphrase);
						//retrieves a private key based on the secret of the application
						var privateKey = hash.digest('hex');
						//generates a wallet with the combination of the email and the password
						var wallet = JSON.parse(ethwallet.fromPrivateKey(new Buffer(privateKey, 'hex')).toV3String('hex'));
						//captures the address from the wallet
						var address = wallet.address;
						//TODO: add ether to the address
						//
						var token = app.jwt.sign(user, app.config.secret, { expiresIn: config.tokenExpiration });					
						res.json({
							user: user.name,
							address: address,
							token: token
						});
					}
				});
			}



			console.log(data);
		});



		var user = users.find(req.body.email);
		var code = vcodes.find(req.body.email);

		//#region Validation
		if (!user) {
			res.status(403).json({ message: 'Invalid credentials' });
			return;
		}

		if (user.password && user.password.length > 0) {
			res.status(422).json({
				message: 'Password already defined, if you forgot it, try to recover'
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

		if (req.body.password != req.body.passwordConfirmation) {
			res.status(422).json({
				message: "Password and Password Confirmation doesn't match"
			});
			return;
		}

		if (!code) {
			res.status(422).json({
				message: "You must first request an activation code"
			});
			return;
		}

		if (code.code != req.body.code) {
			res.status(422).json({
				message: "Invalid verification code"
			});
			return;
		}
		//#endregion

		user.password = sha1(req.body.password);
		user.isActive = true;
		users.update(user);
		vcodes.markUsed(code);
		var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
		res.json({
			user: user.name,
			token: token
		});
	});

	/**
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
var axios = require('axios');
var mailService = require('../common/mail.service');
var sha1 = require('sha1');
var utils = require('../common/utils');
var users = require('../data/user.data');

var verification_codes = require('../data/verification.code.data');

module.exports = function (app) {
	/**
	 * Generates a verification code for signin process.
	 * TODO: request ledger registry to confirm user password creation.
	 * TODO: remove LokiJS and add blockchain signin.
	 */
	app.post('/authentication/verification', function(req, res){
		var results = users.data.find(({'email': req.body.email}));
		if(results.length > 0){
			var user = results[0];
			var code = utils.generateCode();
			verification_codes.data.insert({'email': req.body.email, 'code': code, 'timestamp': utils.timestamp()});
			mailService.sendVerificationCode(user.email, user.name, code);
			res.json({
				success: true,
				message: 'check your email address to get the verification code'
			});
		}
		else{
			res.json({
				success: false,
				message: 'invalid credentials'
			});
		}
	});
	/**
	 * Generates user password.
	 */
	app.post('/authentication/createpassword', function(req, res){
		var results = users.data.find({'email': req.body.email});
		var user = results.length > 0 ? results[0] : null;
		var codes = verification_codes.data.chain().find('email', req.body.email).simplesort('timestamp', true).data();

		//#region Validation
		if(!user){
			res.json({
				success:false,
				message: 'Invalid credentials'
			});
			return;
		}

		if(user.password && user.password.length > 0){
			res.json({
				success:false,
				message: 'Password already defined, if you forgot it, try to recover'
			});
			return;
		}

		if(!req.body.password || req.body.password.length === 0){
			res.json({
				success: false,
				message: "Please inform a password"
			});
			return;
		}

		if(!req.body.passwordConfirmation || req.body.passwordConfirmation.length === 0){
			res.json({
				success: false,
				message: "Please inform a password confirmation"
			});
			return;
		}

		if(req.body.password != req.body.passwordConfirmation){
			res.json({
				success: false,
				message: "Password and Password Confirmation doesn't match"
			});
			return;
		}

		if(codes.length == 0){
			res.json({
				success: false,
				message: "You must first request an activation code"
			});
			return;
		}

		if(codes[0].code != req.body.code){
			res.json({
				success: false,
				message: "Invalid verification code"
			});
			return;
		}
		//#endregion
		
		user.password = sha1(req.body.password);
		users.data.update(user);
		var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
		res.json({
			success: true,
			user: user,
			token: token
		});
	});

	/**
	 * Allows user signin by providing email, password and verification_code
	 */
    app.post('/authentication/signin', function (req, res) {
		var results = users.data.find({'email': req.body.email});
		var user = results.length > 0 ? results[0] : null;
		if (user.password == sha1(req.body.password)) {
			var codes = verification_codes.data.chain().find('email', req.body.email).simplesort('timestamp', true).data();
			if(codes.length > 0){
				if(codes[0].code == req.body.code){
					var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
					res.json({
						success: true,
						user: user,
						token: token
					});
				}
				else{
					res.json({
						success: false,
						message: 'Invalid Verification Code'
					})
				}
			}else{
				res.json({
					success: false,
					message: 'Please request a Verification Code First'
				})
			}			
		}
		else {
			res.json({
				success: false,
				message: 'Invalid Credentials'
			});
		}
	});
	/**
	 * Executes the signout process
	 */
    app.appRouter.get('/authentication/signout', function (req, res) {
        res.send({ ok: "ok" });
    });
}
var axios = require('axios');
var mailService = require('../common/mail.service');
var sha1 = require('sha1');
var utils = require('../common/utils');
var users = require('../data/user.data');
var vcodes = require('../data/verification.code.data');

module.exports = function (app) {
	/**
	 * Generates a verification code for signin process.
	 * TODO: request ledger registry to confirm user password creation.
	 * TODO: remove LokiJS and add blockchain signin.
	 */
	app.post('/authentication/verification', function(req, res){
		if(!req.body.email || req.body.email == ''){
			res.json({
				success: false,
				message: "Email can't be empty"
			});
			return;
		}

		var user = users.find(req.body.email);
		if(!user){
			res.json({
				success: false,
				message: 'invalid credentials'
			});
			return;
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
			success: true,
			message: 'Please check your email address to get the verification code'
		});
	});
	/**
	 * Generates user password.
	 */
	app.post('/authentication/createpassword', function(req, res){
		var user = users.find(req.body.email);
		var code = vcodes.find(req.body.email);

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

		if(!code){
			res.json({
				success: false,
				message: "You must first request an activation code"
			});
			return;
		}

		if(code.code != req.body.code){
			res.json({
				success: false,
				message: "Invalid verification code"
			});
			return;
		}
		//#endregion
		
		user.password = sha1(req.body.password);
		users.update(user);
		vcodes.markUsed(code);
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
		var user = users.find(req.body.email);
		if(!user){
			res.json({
				success: false,
				message: 'Invalid Credentials'
			});
			return;
		}

		var vcode = vcodes.find(user.email);
		if(!vcode){
			res.json({
				success: false,
				message: 'Please request a Verification Code First'
			})
			return;
		}

		if(vcode.code != req.body.code){
			res.json({
				success: false,
				message: 'Invalid Verification Code'
			});
			return;
		}

		if(user.password == sha1(req.body.password)){
			vcodes.markUsed(vcode);
			var token = app.jwt.sign(user, app.config.secret, { expiresIn: "14 days" });
			res.json({
				success: true,
				user: user,
				token: token
			});
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
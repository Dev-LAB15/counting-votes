var axios = require('axios');
var mailService = require('../common/mail.service');
var sha1 = require('sha1');
var utils = require('../common/utils');
var users = require('../data/user.data');

var verification_codes = require('../data/verification.code.data');

module.exports = function (app) {
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

    app.post('/authentication/signin', function (req, res) {
		//query blockchain for user credentials http using axios
		/*
		axios.get(reqEnd)
            .then(resp => {
                console.log(resp.data);
                response.send(resp.data);
            })
            .catch(error => {
                console.log(error);
                response.send({ success: false, data: error });
            });
		*/
		var results = users.data.find({'email': req.body.email});
		var user = results.length > 0 ? results[0] : null;
		if (user.password == sha1(req.body.password)) {
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
				message: 'invalid credentials'
			});
		}
	});
	



    app.appRouter.get('/authentication/signout', function (req, res) {
        res.send({ ok: "ok" });
    });
}
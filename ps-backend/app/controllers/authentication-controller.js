//http library
var axios = require('axios');
var sha1 = require('sha1');

module.exports = function (app) {
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
		
		var user = { 'email': 'admin@cv.nl', 'password': 'admin' };
		if (user.password == sha1(req.body.password)) {
			var token = app.jwt.sign(user, config.secret, { expiresIn: "14 days" });
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
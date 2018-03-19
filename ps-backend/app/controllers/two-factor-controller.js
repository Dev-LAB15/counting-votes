var utils = require('../common/utils');
var mailService = require('../common/mail.service');
var userService = require('../services/user.service');
var vcodes = require('../data/verification.code.data');

module.exports = function (app) {
    /**
	 * Generates a verification code for signin process.
	 * TODO: request ledger registry to confirm user password creation.
	 * TODO: remove LokiJS and add blockchain signin.
	 */
    app.post('/twofactor/verification', function (req, res) {
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
}
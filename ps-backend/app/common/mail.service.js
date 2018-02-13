var config = require('../../config.json');
var sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(config.sendGridApiKey);

module.exports.sendVerificationCode = function(to, name, code){  
    var msg = {
        to: to,
        from: config.sendGridEmailFrom,
        subject: 'Your Verification Code',
        html: `
        Dear ${name}, <br />
        This is your activation code: ${code}.<br /><br />
        Best Regards.
        `
    };
    sendGridMail.send(msg);
}
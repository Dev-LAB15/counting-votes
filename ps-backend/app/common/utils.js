var config = require('../../config.json');

exports.generateCode = function() {
    var code = "";
    for(var i = 0; i< config.verification_code_length; i++)
        code+= config.verification_code_characters.charAt(Math.floor(Math.random() * config.verification_code_length));
    return code;
}

exports.timestamp = function(){
    var ts = Math.round((new Date()).getTime() / 1000);
    return ts;
}
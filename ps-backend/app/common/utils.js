/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
var config = require('../../config.json');
var os = require('os');

exports.generateRandom = function (length) {
    var code = "";
    for (var i = 0; i < length; i++)
        code += config.verification_code_characters.charAt(Math.floor(Math.random() * length));
    return code;
}

exports.generateCode = function () {
    var code = "";
    for (var i = 0; i < config.verification_code_length; i++)
        code += config.verification_code_characters.charAt(Math.floor(Math.random() * config.verification_code_length));
    return code;
}

exports.timestamp = function () {
    var ts = Math.round((new Date()).getTime() / 1000);
    return ts;
}

exports.getComputerName = function () {
    return os.hostname();
}
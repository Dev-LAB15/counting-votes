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
 
var loki = require('lokijs');
var utils = require('../common/utils');
var db = new loki('verification.codes.json');
var data = db.addCollection('verification_code', {indices: ['email']});

module.exports.save = function(vcode){
    data.insert(vcode);
}

module.exports.markUsed =function(vcode){
    vcode.used = true;
    data.update(vcode);
}



module.exports.find = function(email){
    var results = data.chain()
        .where(function(obj){ 
            return obj.email === email && !obj.used 
        })
        .simplesort('timestamp', true)
        .data();
    if(results.length > 0)
        return results[0];
    return null;
}
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
var loki = require('lokijs');
var db = new loki('users.json');
var data = db.addCollection('users', { indices: ['email'] });

data.insert({ name: 'Moises', email: 'moises@lab15.io', isActive: false, role: 'Chairman' });
data.insert({ name: 'Eduardo', email: 'eduardo@lab15.io', isActive: false, role: 'Chairman' });
data.insert({ name: 'Jose', email: 'jmoisespg@gmail.com', isActive: false, role: 'Teller' });

module.exports.data = data;

module.exports.find = function(email) {
    var results = data.find(({ 'email': email }));
    if (results.length > 0)
        return results[0];
    return null;
}

module.exports.update = function(user) {
    data.update(user);
}
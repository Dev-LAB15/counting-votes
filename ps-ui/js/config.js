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
 
var apiEndpoint = 'http://localhost:3000';
var i18n;
var axiosHeaders;

window.addEventListener('load', function () {
    Vue.use(VueI18n);
    Vue.use(Toasted);
    i18n = new VueI18n(lang.nl);
    axiosHeaders = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": this.window.localStorage.token
        }
    }
});


function addTeller(teller) {
    var tellers, tellersString;
    try {
        tellersString = window.localStorage.getItem('tellers');
    } catch (err) {

    }

    if (!tellersString) {
        tellers = new Array();
    } else {
        var tellers = JSON.parse(tellersString)
    }
    if (tellers.indexOf(teller) <= -1) {
        tellers.push(teller);
        window.localStorage.setItem('tellers', JSON.stringify(tellers));
    }
}

function getTellers() {
    try {
        return JSON.parse(window.localStorage.getItem('tellers'));
    } catch (err) {
        return null;
    }
}

function removeTeller(email) {
    var tellers = getTellers();
    if (tellers) {
        var index = tellers.indexOf(email);
        if (index > -1) {
            tellers.splice(index, 1);
        }
        if (tellers.length == 0) {
            window.localStorage.removeItem('tellers');
        } else {
            window.localStorage.setItem('tellers', JSON.stringify(tellers));
        }
    }
}

function toDateString(utx) {
    return (new Date(utx * 1000)).toLocaleString('nl')
}
var apiEndpoint = 'http://localhost:3000';
var i18n;
var axiosHeaders;

window.addEventListener('load', function () {
    Vue.use(VueI18n);
    Vue.use(Toasted);
    i18n = new VueI18n(lang);
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
    var date = new Date(utx * 1000);
    var day = "0" + date.getDay();
    var month = "0" + date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    return `${day}/${month.substr(-2)}/${year} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;

}
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
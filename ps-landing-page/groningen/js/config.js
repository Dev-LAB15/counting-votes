var apiEndpoint = 'http://localhost:3000';
var i18n;
var axiosHeaders;
var totalVoters = 5162;

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


function toDateString(utx) {
    return (new Date(utx * 1000)).toLocaleString('nl')
}
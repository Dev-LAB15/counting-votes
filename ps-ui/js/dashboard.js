window.addEventListener('load', function () {

    let tellers = getTellers();

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            model: {
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: 'Teller'
            }
        },
        methods: {
        }

    });
})
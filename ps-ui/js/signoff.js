window.addEventListener('load', function () {

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: [],
            model: {
                email: '',
                password: ''
            }
        },
        methods: {
            authenticate() {
                axios.post(apiEndpoint + '/authentication/signoff', vm.model)
                    .then(res => {
                        vm.authenticationFinishing();
                        vm.clearModel();
                        vm.$toasted.show('SignOff Ok', {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(err => {
                        vm.authenticationFinishing();
                        vm.clearModel();
                        vm.$toasted.show('SignOff Error', {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            clearModel() {
                vm.model.email = "";
                vm.model.password = "";
            },
            authenticationFinishing() {
                $('.sidebar-wrapper, .content-wrapper, footer').addClass('show');
                $('section > .row').removeClass('justify-content-md-center');
                $('section').addClass('has-footer');
            }
        }

    });
    vm.$mount('#app');
    $(function () {
        $('.btn-authenticate').click(function () {
            if (!vm.model.email || !vm.model.password) {
                vm.$toasted.show('Invalid Credentials', {
                    theme: "bubble",
                    position: "bottom-center",
                    duration: 3000
                });
                vm.clearModel();
                return;
            }
            vm.authenticate();

        });
    });
});

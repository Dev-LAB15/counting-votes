window.addEventListener('load', function () {
    if (!this.window.localStorage.token) {
        this.window.location = 'index.html';
        return;
    }
    var tellers = getTellers();
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: tellers || [],
            model: {
                email: '',
                password: ''
            }
        },
        mounted: function () {
            $('#app').fadeIn();
            axios.get(apiEndpoint + '/verification/getdeviation', axiosHeaders)
                .then(res => {
                    if (res.data.deviation > 0) {
                        $('#deviationExplanation').show();
                    }
                })
                .catch(err => {

                })
        },
        methods: {
            authenticate() {
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/signoff', vm.model)
                    .then(res => {
                        $('#loading-modal').modal('hide');
                        vm.clearModel();
                        vm.$toasted.show('SignOff Ok', {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(err => {
                        $('#loading-modal').modal('hide');
                        var msg = vm.$t('message.unknownError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }
                        vm.clearModel();
                        vm.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            clearModel() {
                vm.model.email = "";
                vm.model.explanation = "";
                vm.model.password = "";
            },
            canSubmit() {
                axios.get(apiEndpoint + '/authentication/submit', axiosHeaders)
                    .then(res => {
                        $('#success').modal();
                        window.localStorage.clear();
                    })
                    .catch(err => {
                        var msg = vm.$t('message.unknownError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }
                        vm.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            }
        }

    });
    vm.$mount('#app');

    $(function () {
        $('.sidebar-wrapper, .content-wrapper, footer').addClass('show');
        $('section > .row').removeClass('justify-content-md-center');
        $('section').addClass('has-footer');
    });

    $(function () {
        $('.btn-authenticate').click(function () {
            if (!vm.model.email || !vm.model.password) {
                vm.$toasted.show(vm.$t('message.invalidCredentials'), {
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

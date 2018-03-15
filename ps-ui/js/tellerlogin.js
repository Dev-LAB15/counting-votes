window.addEventListener('load', function () {

    if (!this.window.localStorage.token) {
        this.window.location = 'index.html';
        return;
    }

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: [],
            model: {
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: '4'
            }
        },
        mounted: function () {
            $('#app').fadeIn();
        },
        methods: {
            requestVerificationCode: function (event) {
                axios.post(apiEndpoint + '/authentication/verification', vm.model).then(resp => {
                    if (resp.data.isActive) {
                        this.showModalSignIn(event);
                    } else {
                        this.showModalCreatePassword(event);
                    }
                }
                ).catch(error => {
                    this.$toasted.show(error.response.data.message, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );

            },
            showModalCreatePassword: function (event) {
                $('#create-password-modal').modal();
            },
            showModalSignIn: function (event) {
                $('#sign-in-modal').modal();
            },
            requestCreatePassword: function (event) {
                $('#create-password-modal').modal('hide');
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/createpassword', vm.model).then(resp => {
                    $('#loading-modal').modal('hide');
                    addTeller(resp.data.user);
                    vm._data.tellers.push(resp.data.user);
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                    $('section > .row').removeClass('justify-content-md-center');

                }
                ).catch(error => {
                    $('#loading-modal').modal('hide');
                    var msg = this.$t('message.unhandledError');
                    if (error && error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    this.$toasted.show(msg, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );
            },
            requestSignIn: function (event) {
                $('#sign-in-modal').modal('hide');
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/signin', vm.model).then(resp => {
                    $('#loading-modal').modal('hide');
                    addTeller(resp.data.user);
                    vm._data.tellers.push(resp.data.user);
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                    $('section > .row').removeClass('justify-content-md-center');
                }).catch(error => {
                    $('#loading-modal').modal('hide');
                    var msg = this.$t('message.unhandledError');
                    if (error && error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    this.$toasted.show(msg, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );
            },
            goToDashboard: function (event) {
                window.location = 'dashboard.html';
            }
        }

    });
    vm.$mount('#app');

    var tellers = getTellers();
    if (tellers) {
        for (var i = 0; i < tellers.length; i++)
            vm.tellers.push(tellers[i]);
    }
});

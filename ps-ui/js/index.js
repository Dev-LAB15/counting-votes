window.addEventListener('load', function () {

    if (this.window.localStorage.token) {
        this.window.location = 'tellerlogin.html';
        return;
    }


    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            model: {
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: '3'
            }
        },
        mounted: function () {
            $('#app').fadeIn();
        },
        methods: {
            requestVerification: function (event) {
                if (!vm.model.email || vm.model.email == '') {
                    this.$toasted.show(this.$t('message.errorEmailCannotBeEmpty'), {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                    return;
                }
                axios.post(apiEndpoint + '/authentication/verification', vm.model).then(resp => {
                    $('#two-factor-modal').modal();
                    if (resp.data.isActive) {
                        this.showModalSignIn(event);
                    } else {
                        this.showModalCreatePassword(event);
                    }
                }
                ).catch(error => {
                    var msg = 'Unknown error, check if the application is running there is access to the node';
                    if (error && error.response && error.response.data && error.response.data.message)
                        msg = error.response.data.message;
                    this.$toasted.show(msg, {
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
                axios.post(apiEndpoint + '/authentication/createpassword', vm.model)
                    .then(resp => {
                        $('#loading-modal').modal('hide');
                        window.localStorage.chairman = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = 'tellerlogin.html';
                    }
                    ).catch(error => {
                        $('#loading-modal').modal('hide');
                        this.$toasted.show(error.response.data.message, {
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
                axios.post(apiEndpoint + '/authentication/signin', vm.model)
                    .then(resp => {
                        $('#loading-modal').modal('hide');
                        window.localStorage.chairman = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = 'tellerlogin.html';
                    })
                    .catch(error => {
                        $('#loading-modal').modal('hide');
                        this.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            }
        }

    });
    vm.$mount('#app');
});

window.addEventListener('load', function () {

    if (this.window.localStorage.token) {
        this.window.location = 'tellerlogin.html';
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
                role: 'Chairman'
            }
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
                axios.post(apiEndpoint + '/authentication/createpassword', vm.model)
                    .then(resp => {
                        window.localStorage.chairman = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = 'tellerlogin.html';
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
            requestSignIn: function (event) {
                axios.post(apiEndpoint + '/authentication/signin', vm.model)
                    .then(resp => {
                        window.localStorage.chairman = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = 'tellerlogin.html';
                    })
                    .catch(error => {
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

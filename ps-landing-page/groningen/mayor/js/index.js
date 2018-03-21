window.addEventListener('load', function () {

    if (this.window.localStorage.token) {
        this.window.location = '/groningen/mayor/election-results.html';
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
                role: '2'
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
                axios.post(apiEndpoint + '/twofactor/verification', vm.model).then(resp => {
                    if (resp.data.isActive) {
                        this.showModalSignIn(event);
                    } else {
                        this.showModalCreatePassword(event);
                    }
                }
                ).catch(error => {
                    vm.clearModel();
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
                axios.post(apiEndpoint + '/mayor/createpassword', vm.model)
                    .then(resp => {
                        $('#loading-modal').modal('hide');
                        window.localStorage.mayor = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = '/groningen/mayor/election-results.html';
                    }
                    ).catch(error => {
                        vm.clearModel();
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
                axios.post(apiEndpoint + '/mayor/signin', vm.model)
                    .then(resp => {
                        $('#loading-modal').modal('hide');
                        window.localStorage.mayor = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = '/groningen/mayor/election-results.html';
                    })
                    .catch(error => {
                        $('#loading-modal').modal('hide');
                        vm.clearModel();
                        this.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            clearModel: function(){
                this.model.email = '';
                this.model.password = '';
                this.model.passwordConfirmation = '';
                this.model.code = '';

            }
        }

    });
    vm.$mount('#app');
});

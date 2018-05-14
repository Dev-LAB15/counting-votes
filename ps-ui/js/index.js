/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
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
                axios.post(apiEndpoint + '/twofactor/verification', vm.model).then(resp => {
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
                        vm.clearModel();
                        window.localStorage.chairman = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = 'tellerlogin.html';
                    }).catch(error => {
                        vm.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                        vm.clearModel();
                        $('#loading-modal').modal('hide');
                    });
            },
            requestSignIn: function (event) {
                $('#sign-in-modal').modal('hide');
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/signin', vm.model)
                    .then(resp => {
                        window.localStorage.chairman = resp.data.user;
                        window.localStorage.token = resp.data.token;
                        window.location = 'tellerlogin.html';
                    })
                    .catch(error => {
                        $('#loading-modal').modal('hide');
                        vm.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                        vm.clearModel();
                    });
            },
            clearModel: function () {
                this.model.email = '',
                    this.model.password = '',
                    this.model.passwordConfirmation = '',
                    this.model.code = ''
            }
        }

    });
    vm.$mount('#app');
});

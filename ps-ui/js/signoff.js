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
            showDeviation: false,
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
                        this.showDeviation = true;
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
                        if (res.data.role == '4') {
                            removeTeller(res.data.email);
                        }
                        else if (res.data.role == '3') {
                            vm.canSubmit();
                            return;
                        }
                        var tellers = getTellers();
                        this.tellers = tellers || [];
                        if (!tellers || tellers.length == 0) {
                            if (this.showDeviation) {
                                $('#deviationExplanation').show();
                            }
                        }

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

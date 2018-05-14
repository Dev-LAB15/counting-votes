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
    
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            model: {
                isVerifying: false,
                empty: true,
                success: false,
                message: ''
            }
        },
        mounted: function () {
            $('#app').fadeIn();
            if (vm) {
                vm.model.message = this.$t('message.verify');
            }
        },
        methods: {
            verifyVotes: function () {
                vm.model.isVerifying = true;
                vm.model.message = this.$t('message.verifyingPleaseWait');

                if (vm.model.recount !== undefined) {
                    if (vm.model.recount) {
                        axios.post(apiEndpoint + '/verification/recount', vm.model, axiosHeaders)
                            .then(resp => {
                                window.location = 'counting.html';
                            });
                    } else {
                        window.location = 'overview.html';
                    }

                    return;
                }

                axios.post(apiEndpoint + '/verification/verifyvotes', vm.model, axiosHeaders)
                    .then(resp => {
                        vm.model.isVerifying = false;
                        vm.model.yes = resp.data.yes || false;
                        vm.model.no = resp.data.no || false;
                        vm.model.blank = resp.data.blank || false;
                        vm.model.invalid = resp.data.invalid || false;
                        vm.model.success = true;
                        vm.model.recount = resp.data.needsRecount || false;

                        switch (resp.data.message) {
                            case "Verification already happened and it was successful. Input disregarded.":
                                vm.model.recount = false;
                                vm.model.message = this.$t('message.verificationAlreadyHappened');
                                return;
                            case "Recount necessary before new verification attempt.":
                                vm.model.message = this.$t('message.recountNecessaryBeforeNewVerificationAttempt');
                                break;
                            case "Counting must begin first.":
                                vm.model.message = this.$t('message.countingMustBeginFirst');
                                break;
                            case "Needs Recount.":
                                vm.model.message = this.$t('message.needsRecount');
                                break;
                            default:
                                vm.model.message = this.$t('message.unhandledError');
                                break;
                        }

                        if (resp.data.success) {
                            vm.model.recount = false;
                            vm.model.message = this.$t('message.continue');
                            return;
                        }
                    }
                    ).catch(error => {
                        vm.model.message = this.$t('message.verify');
                        vm.model.isVerifying = false;
                    });
            }
        }

    });
    vm.$mount('#app');

    (function () {
        $('.form-control').keyup(function () {
            var empty = false;
            $('.form-control').each(function () {
                if ($(this).val() == '') {
                    empty = true;
                }
            });

            vm.model.empty = empty;
        });

        $('.btn-verify').on('click', function () {
            $('.verification-check').addClass('show');
        });
    })();
});
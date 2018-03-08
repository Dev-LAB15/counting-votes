window.addEventListener('load', function () {
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
        mounted: function() {
            if (vm) {
                vm.model.message =  this.$t('message.verify');
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

                        vm.model.yes = resp.data.yes;
                        vm.model.no = resp.data.no;
                        vm.model.blank = resp.data.blank;
                        vm.model.invalid = resp.data.invalid;
                        vm.model.success = true;

                        if (!vm.model.yes || !vm.model.no || !vm.model.blank || !vm.model.invalid) {
                            vm.model.recount = true;
                            vm.model.message = this.$t('message.recount');
                        } else {
                            vm.model.message = this.$t('message.continue');
                            vm.model.recount = false;
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
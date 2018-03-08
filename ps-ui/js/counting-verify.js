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
                success: false
            }
        },
        mounted: function() {
            if (vm) {
                vm._data.model.message =  this.$t('message.verify');
            }
        },
        methods: {
            verifyVotes: function () {
                vm.model.isVerifying = true;
                vm.model.message = this.$t('message.verifyingPleaseWait');

                axios.post(apiEndpoint + '/verification/verifyVotes', vm.model, axiosHeaders)
                    .then(resp => {
                        vm.model.isVerifying = false;

                        vm.model.yes = resp.yes;
                        vm.model.no = resp.no;
                        vm.model.blank = resp.blank;
                        vm.model.invalid = resp.invalid;
                        vm.model.success = true;

                        if (!vm.model.yes || !vm.model.no || !vm.model.blank || !vm.model.invalid) {
                            vm.model.message = this.$t('message.recount');
                        } else {
                            vm.model.message = this.$t('message.continue');
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
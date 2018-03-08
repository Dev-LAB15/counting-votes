window.addEventListener('load', function () {



    let tellers = getTellers();


    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            paused: false,
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            model: {
                qrcode: ''
            }
        },
        methods: {
            manualInput: function () {
                axios.post(apiEndpoint + '/scan/qrcode', vm.model, axiosHeaders)
                    .then(resp => {
                        vm.$toasted.show(this.$t('message.qrCodeScannedSuccessfully'), {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(error => {
                        this.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            privatePowerOfAttorney: function () {
                axios.post(apiEndpoint + '/scan/powerofattorney', { type: "private" })
                    .then(resp => {
                        vm.$toasted.show(this.$t('message.powerOfAttorneyRegisteredSuccessfully'), {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(error => {
                        this.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            writtenPowerOfAttorney: function () {
                axios.post(apiEndpoint + '/scan/powerofattorney', { type: "written" })
                    .then(resp => {
                        vm.$toasted.show(this.$t('message.powerOfAttorneyRegisteredSuccessfully'), {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(error => {
                        this.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            votersPass: function () {
                axios.post(apiEndpoint + '/scan/voterspass')
                    .then(resp => {
                        vm.$toasted.show(this.$t('message.votersPassRegisteredSuccessfyully'), {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(error => {
                        this.$toasted.show(error.response.data.message, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            objection: function () {
                axios.post(apiEndpoint + '/scan/objection')
                    .then(resp => {
                        vm.$toasted.show(this.$t('message.objectionToPilotRegisteredSuccessfully'), {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
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

    $(function () {
        $('[data-attorney]').on('click', function () {
            $('#power-attorney .btn-submit').attr('disabled', false);

            if ($(this).data('attorney') == 'written') {
                console.log('written!');
                $('#power-attorney .btn-submit').attr({ "data-toggle": "modal", "data-target": "#written-authorization" });
            } else {
                console.log('remove written!');
                $('#power-attorney .btn-submit').removeAttr("data-toggle data-target");
            }
        });
    });
})
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
            /**
             * Decodes a QR Code content from the camera.
             * @param {qrcode decoded content} content 
             */
            onDecode(content) {
                $('#confirm-qrcode-modal').modal()
                    .one('click', '#button-yes', function (e) {

                        axios.post(apiEndpoint + '/scan/qrcode', vm.model, axiosHeaders)
                            .then(resp => {
                                vm.$toasted.show(this.$t('message.qrCodeScannedSuccessfully'), {
                                    theme: "outline",
                                    position: "bottom-center",
                                    duration: 3000
                                });
                            })
                            .catch(error => {
                                console.log(error.response);
                                //TODO fix 403 error accordingly.
                            }
                            );
                    });

            },

            onLocate(points) {

            },

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
})
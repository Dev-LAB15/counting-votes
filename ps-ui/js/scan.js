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
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: 'Teller'
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

                        axios.post(apiEndpoint + '/scan/qrcode', vm.model)
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

            }
        }

    });
})
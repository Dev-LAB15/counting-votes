
window.addEventListener('load', function () {

    /** 
     * Used to refresh transactions every 5 seconds from the server.
    */
    function loadTransactions() {
        axios.get(apiEndpoint + '/transaction/list', axiosHeaders)
            .then(res => {
                if (res.data) {
                    for (let i = 0; i < res.data.length; i++) {
                        vm._data.transactions.push(res.data[i]);
                    }
                }
            });
    }


    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            transactions: [],
            model: {
                qrcode: ''
            }
        },
        mounted: function () {
            setInterval(loadTransactions, 15000);
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
                axios.post(apiEndpoint + '/scan/voterspass', {}, axiosHeaders)
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
                axios.post(apiEndpoint + '/scan/objection', {}, axiosHeaders)
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
    //vm.$mount('#app');

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
window.addEventListener('load', function () {

    function fetchTransactions() {
        axios.get(apiEndpoint + '/transaction/list', axiosHeaders)
            .then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    vm.transactions.push(res.data[i]);
                }
            });
    }


    let tellers = getTellers();
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            paused: false,
            powerOfAttorney: false,
            transactions: [],
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            model: {
                qrcode: ''
            }
        },
        mounted: function () {
            setInterval(fetchTransactions, 15000);
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
                        var msg;
                        if (error) {
                            msg = error.toString();
                        }
                        else {
                            msg = 'unknown error';
                        }
                        this.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            cancelPrivatePowerOfAttorney: function () {
                window.powerOfAttorney = false;
                $('#private-power-of-attorney-cancellation').hide();
            },
            privatePowerOfAttorney: function () {
                window.powerOfAttorney = true;
                $('#private-power-of-attorney-cancellation').show();

            },
            writtenPowerOfAttorney: function () {
                axios.post(apiEndpoint + '/scan/powerofattorney', {}, axiosHeaders)
                    .then(resp => {
                        vm.$toasted.show(this.$t('message.powerOfAttorneyRegisteredSuccessfully'), {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(error => {
                        var msg;
                        if (error) {
                            msg = error.toString();
                        }
                        else {
                            msg = 'unknown error';
                        }
                        this.$toasted.show(msg, {
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
                        var msg;
                        if (error) {
                            msg = error.toString();
                        }
                        else {
                            msg = 'unknown error';
                        }
                        this.$toasted.show(msg, {
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
                        var msg;
                        if (error) {
                            msg = error.toString();
                        }
                        else {
                            msg = 'unknown error';
                        }
                        this.$toasted.show(msg, {
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
                $('#power-attorney .btn-submit').attr({ "data-toggle": "modal", "data-target": "#written-authorization" });
            } else {
                $('#power-attorney .btn-submit').removeAttr("data-toggle data-target");
            }
        });
    });

    $(function () {
        $('#private-power-of-attorney-cancellation button')
    })
})
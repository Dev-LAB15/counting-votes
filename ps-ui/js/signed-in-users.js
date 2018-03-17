window.addEventListener('load', function () {
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            model: {
                email: "",
                password: ""
            }
        },
        methods: {
            updateModel(email) {
                this.model.email = email;
            },
            requestSignOut() {
                $('#sign-out-modal').modal('hide');
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/signout', this.model)
                    .then(res => {
                        $('#loading-modal').modal('hide');
                        removeTeller(this.model.email);
                        this.tellers = [];
                        var updatedTellers = getTellers();
                        if (updatedTellers) {
                            for (var i = 0; i < updatedTellers.length; i++) {
                                this.tellers.push(updatedTellers[i]);
                            }
                        }
                    })
                    .catch(err => {
                        $('#loading-modal').modal('hide');
                        var msg = this.$t('message.unhandledError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }

                        this.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            }
        },
        mounted: function () {
            $('#app').fadeIn();
        }

    });
});
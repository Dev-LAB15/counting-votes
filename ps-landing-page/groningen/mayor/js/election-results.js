window.addEventListener('load', function () {

    if (!this.window.localStorage.token) {
        this.window.location = '/groningen/mayor/';
    }

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            model: {
                password: '',
                yes: 0,
                no: 0,
                blank: 0,
                invalid: 0,

                collectedPollingCards: 0,
                collectedPowerOfAttorneys: 0,
                collectedVoterPasses: 0,

                scannedPollingCards: 0,
                scannedPowerOfAttorneys: 0,
                registeredObjections: 0,
                registeredPowerOfAttorneys: 0,
                registeredVoterPasses: 0,

                totalVotes: 0,
                totalRegisteredVoters: 0,
                totalAdmitedVoters: 0
            }
        },
        methods: {
            canSignOff: function () {
                axios.get(apiEndpoint + '/mayor/cansignoff', axiosHeaders)
                    .then(res => {
                        $('#sign-in-modal').modal();
                    })
                    .catch(err => {
                        var msg = vm.$t('message.unhandledError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }
                        this.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            requestSignOff: function () {
                $('#sign-in-modal').modal('hide');
                var model = {
                    password: this.model.password
                }
                axios.post(apiEndpoint + '/mayor/signoff', model, axiosHeaders)
                    .then(res => {
                        $('#success-modal').modal();
                        window.localStorage.clear();
                    })
                    .catch(err => {
                        var msg = vm.$t('message.unhandledError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }
                        this.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            getSummary: function () {
                axios.get(apiEndpoint + '/mayor/getsummary', axiosHeaders)
                    .then(res => {
                        vm.model.yes = parseInt(res.data.yesGlobal);
                        vm.model.no = parseInt(res.data.noGlobal);
                        vm.model.blank = parseInt(res.data.blankGlobal);
                        vm.model.invalid = parseInt(res.data.invalidGlobal);
                        vm.model.totalVotes = 0;
                        vm.model.totalVotes += parseInt(res.data.yesGlobal);
                        vm.model.totalVotes += parseInt(res.data.noGlobal);
                        vm.model.totalVotes += parseInt(res.data.blankGlobal);
                        vm.model.totalVotes += parseInt(res.data.invalidGlobal);

                        vm.model.yesProgress = (vm.model.yes / vm.model.totalVotes) * 100;
                        vm.model.yesProgress = Math.round(vm.model.yesProgress);
                        vm.model.yesProgress = `width: ${vm.model.yesProgress}%`;

                        vm.model.noProgress = (vm.model.no / vm.model.totalVotes) * 100;
                        vm.model.noProgress = Math.round(vm.model.noProgress);
                        vm.model.noProgress = `width: ${vm.model.noProgress}%`;

                        vm.model.blankProgress = (vm.model.blank / vm.model.totalVotes) * 100;
                        vm.model.blankProgress = Math.round(vm.model.blankProgress);
                        vm.model.blankProgress = `width: ${vm.model.blankProgress}%`;

                        vm.model.invalidProgress = (vm.model.invalid / vm.model.totalVotes) * 100;
                        vm.model.invalidProgress = Math.round(vm.model.invalidProgress);
                        vm.model.invalidProgress = `width: ${vm.model.invalidProgress}%`;

                        vm.model.collectedPollingCards = res.data.collectedPollingCards;
                        vm.model.collectedPowerOfAttorneys = res.data.collectedPowerOfAttorneys;
                        vm.model.collectedVoterPasses = res.data.collectedVoterPasses;

                        vm.model.totalAdmitedVoters = 0;
                        vm.model.totalAdmitedVoters += parseInt(res.data.collectedPollingCards);
                        vm.model.totalAdmitedVoters += parseInt(res.data.collectedPowerOfAttorneys);
                        vm.model.totalAdmitedVoters += parseInt(res.data.collectedVoterPasses);

                        vm.model.totalDeviation = 0;
                        vm.model.totalDeviation = vm.model.totalVotes - vm.model.totalAdmitedVoters;

                        vm.model.scannedPollingCards = res.data.scannedPollingCards;
                        vm.model.registeredObjections = res.data.registeredObjections;
                        vm.model.registeredPowerOfAttorneys = res.data.registeredPowerOfAttorneys;
                        vm.model.registeredVoterPasses = res.data.registeredVoterPasses;
                        vm.model.scannedPowerOfAttorneys = res.data.scannedPowerOfAttorneys;

                        vm.model.totalRegisteredVoters = 0;
                        vm.model.totalRegisteredVoters += parseInt(res.data.scannedPollingCards);
                        vm.model.totalRegisteredVoters += parseInt(res.data.registeredObjections);
                        vm.model.totalRegisteredVoters += parseInt(res.data.registeredPowerOfAttorneys);
                        vm.model.totalRegisteredVoters += parseInt(res.data.registeredVoterPasses);
                        vm.model.totalRegisteredVoters += parseInt(res.data.scannedPowerOfAttorneys);
                    })
                    .catch(err => {
                        var errror = err;
                    });
            }
        },
        mounted: function () {
            this.getSummary();
        }

    });

    $(function(){
        $('body').fadeIn();
    })
})
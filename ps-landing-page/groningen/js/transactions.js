window.addEventListener('load', function () {

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            scans: [],
            votes: []
        },
        methods: {
            getScans: function () {
                axios.get(apiEndpoint + '/transaction/scans/all', axiosHeaders)
                    .then(res => {
                        $('#loading-scans').hide();
                        this.scans = [];
                        if (res && res.data && res.data instanceof Array) {
                            for (var i = 0; i < res.data.length; i++) {
                                var converted = {
                                    transactionHash: res.data[i].transactionHash,
                                    timestamp: toDateString(res.data[i].timestamp)
                                }
                                this.scans.push(converted);
                            }
                        }
                    });
            },
            getVotes: function () {
                axios.get(apiEndpoint + '/transaction/votes/all', axiosHeaders)
                    .then(res => {
                        $('#loading-votes').hide();
                        this.votes = [];
                        if (res && res.data && res.data instanceof Array) {
                            for (var i = 0; i < res.data.length; i++) {

                                let voteType = this.$t('message.invalid');
                                switch (res.data[i].voteCode) {
                                    case "1":
                                        voteType = this.$t('message.yes');
                                        break;
                                    case "2":
                                        voteType = this.$t('message.no');
                                        break;
                                    case "3":
                                        voteType = this.$t('message.blank');
                                        break;
                                    default:
                                        voteType = this.$t('message.invalid');
                                        break;
                                }


                                var converted = {
                                    transactionHash: res.data[i].transactionHash,
                                    voteType: voteType,
                                    timestamp: toDateString(res.data[i].timestamp)
                                }
                                this.votes.push(converted);
                            }
                        }
                    });
            }
        },
        mounted: function () {
            $('#app').fadeIn();
            this.getScans();
            this.getVotes();
        }
    });
});
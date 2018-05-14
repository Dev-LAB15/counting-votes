/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
window.addEventListener('load', function () {

    if (!this.window.localStorage.token) {
        this.window.location = 'index.html';
        return;
    }
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            scans: [],
            votes: []
        },
        methods: {
            getScans: function () {
                axios.get(apiEndpoint + '/transaction/scans', axiosHeaders)
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
                axios.get(apiEndpoint + '/transaction/votes', axiosHeaders)
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
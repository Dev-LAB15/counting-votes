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
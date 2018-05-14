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
            model: {}
        },
        mounted: function () {
            $('#app').fadeIn();
        },
        methods: {
            inputControlNumbers: function () {
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/verification/inputcontrolnumbers', vm.model, axiosHeaders)
                    .then(resp => {
                        window.location = 'counting.html';
                    }
                    ).catch(error => {
                        $('#loading-modal').modal('hide');
                    });
            }
        }

    });

    (function () {
        $('.form-control').keyup(function () {
            var empty = false;
            $('.form-control').each(function () {
                if ($(this).val() == '') {
                    empty = true;
                }
            });

            if (empty) {
                $('.btn-continue').attr('disabled', 'disabled');
                $('.toast').removeClass('show');
                var ls = vm.$t('message.fillDataFieldsBelow');
                $('.page-title').html(`<h5>${ls}</h5>`);
            } else {
                $('.page-title').html(`<h5></h5>`);
                $('.btn-continue').removeAttr('disabled');
                $('.toast').addClass('show');
            }
        });
    })();
});
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
        methods: {
            inputControlNumbers: function () {
                axios.post(apiEndpoint + '/verification/inputcontrolnumbers', vm.model, axiosHeaders)
                    .then(resp => {
                        window.location = 'counting.html';
                    }
                    ).catch(error => {

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
            } else {
                $('.btn-continue').removeAttr('disabled');
                $('.toast').addClass('show');
            }
        });
    })();
});
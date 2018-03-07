window.addEventListener('load', function () {
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers()
        },
        methods: {
        }

    });

    (function () {
        $('.form-control').keyup(function() {
            var empty = false;
            $('.form-control').each(function() {
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
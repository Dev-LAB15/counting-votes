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
                $('.btn-verify').attr('disabled', 'disabled');
            } else {
                $('.btn-verify').removeAttr('disabled');
            }
        });

        $('.btn-verify').on('click', function(){
            console.log('verify!');
            $('.verification-check').addClass('show');
        });
    })();
});
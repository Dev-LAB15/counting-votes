window.addEventListener('load', function() {



    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: [],
            model: {
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: 'Teller'
            }
        }

    });

    $(function(){
        $('.btn-authenticate').click(function(){
            $('.sidebar-wrapper, .content-wrapper, footer').addClass('show');
            $('section > .row').removeClass('justify-content-md-center');
            $('section').addClass('has-footer');
        });
    });
});

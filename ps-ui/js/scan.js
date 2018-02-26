window.addEventListener('load', function () {


    let tellers = getTellers();

    if (!tellers || tellers.length == 0) {
        window.location = 'tellerlogin.html';
    }

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            model: {
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: 'Teller'
            }
        },
        methods: {
            /**
             * Decodes a QR Code content from the camera.
             * @param {qrcode decoded content} content 
             */
            onDecode(content) {
                console.log(content);
            },

            onLocate(points) {
                
            }
        }

    });
})
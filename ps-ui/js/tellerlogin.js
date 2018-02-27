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
        },
        methods: {
            requestVerificationCode: function(event) {
                axios.post(apiEndpoint + '/authentication/verification', vm.model).then(resp=>{
                    if (resp.data.isActive) {
                        this.showModalSignIn(event);
                    } else {
                        this.showModalCreatePassword(event);
                    }
                }
                ).catch(error=>{
                    this.$toasted.show(error.response.data.message, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );

            },
            showModalCreatePassword: function(event) {
                $('#create-password-modal').modal();
            },
            showModalSignIn: function(event) {
                $('#sign-in-modal').modal();
            },
            requestCreatePassword: function(event) {
                axios.post(apiEndpoint + '/authentication/createpassword', vm.model).then(resp=>{
                    addTeller(resp.data.user);
                    vm.data.tellers.push(resp.data.user);
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                    $('#create-password-modal').modal('hide');
                }
                ).catch(error=>{
                    this.$toasted.show(error.response.data.message, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );
            },
            requestSignIn: function(event) {
                axios.post(apiEndpoint + '/authentication/signin', vm.model).then(resp=>{
                    addTeller(resp.data.user);
                    vm.data.tellers.push(resp.data.user);
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                    $('#sign-in-modal').modal('hide');
                }
                ).catch(error=>{
                    this.$toasted.show(error.response.data.message, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );
            },
            toggleSignedInTellers: function(event) {
                if (!$('.sidebar-wrapper, .content-wrapper').hasClass('show')) {
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                } else {
                    $('.sidebar-wrapper, .content-wrapper').removeClass('show');
                }

            },
            goToDashboard: function(event) {
                window.location = 'dashboard.html';
            }
        }

    });
    vm.$mount('#app');

    var tellers = getTellers();
    if(tellers){
        for(var i = 0; i < tellers.length; i++)
            vm.tellers.push(tellers[i]);
    }
});

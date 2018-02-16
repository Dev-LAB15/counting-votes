window.onload = function(){
    const messages = {
        en: {
            message: {
                hello: "Hello World!"
            }
        },
        pt: {
            message: {
                hello: "Ola Mundo"
            }
        }
    };
    
    const i18n = new VueI18n({
        locale: 'pt',
        messages
    });
    
    new Vue({ i18n}).$mount('#app');
    
}


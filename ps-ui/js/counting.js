var vm;

window.addEventListener('load', function () {
    vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers()
        },
        methods: {
            registerVote: function (voteId) {

                var vote = { option: voteId };
                axios.post(apiEndpoint + '/counting/vote', vote, axiosHeaders)
                    .then(resp => {
                  
                    }
                    ).catch(error => {
                  
                    }
                    );


                console.log('vote id reached vue vm: ' + voteId);
            }
        }
    });
});
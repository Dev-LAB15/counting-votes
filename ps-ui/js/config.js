var apiEndpoint = 'http://localhost:3000';
var i18n;

window.addEventListener('load', function () {
    Vue.use(VueI18n);
    Vue.use(Toasted);
    i18n = new VueI18n(lang);
});


function addTeller(teller){
    var tellers, tellersString;
    try{
        tellersString = window.localStorage.getItem('tellers');    
    }catch(err){

    }
    

    if(!tellersString){
        tellers = new Array();
    }else{
        var tellers = JSON.parse(tellersString)
    }
    if(tellers.indexOf(teller) < 0){
        tellers.push(teller);
        window.localStorage.setItem('tellers', JSON.stringify(tellers));
    }
}

function getTellers(){
    try{
        return JSON.parse(window.localStorage.getItem('tellers'));
    }catch(err){
        return null;
    }
}


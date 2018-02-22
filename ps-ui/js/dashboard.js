window.addEventListener('load', function () {

    let tellers = getTellers();

    if(!tellers || tellers.length == 0){
        window.location = 'tellerlogin.html';
    }
});
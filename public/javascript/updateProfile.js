import {check, check2, validasi} from '/assets/javascript/module.js'
const action = document.getElementById("buttonAction");
const input = document.querySelectorAll('#tableUtama > tbody > tr > td > input');
const formElement = document.querySelector('table form');

action.addEventListener('click', function(event){
    let test = validasi(input, action);
    let form = new FormData(formElement);
    event.preventDefault();

    if(test === true) {
        fetch(`${window.location.pathname}/${action.dataset.id}`, {method: 'put', body: form})
            .then(check)
            .then(check2)
    } else {
        action.setAttribute('disabled', '');
    }
});

input.forEach(function(e){
    e.addEventListener('keyup', function(event){
        let test = validasi(input, action);
        if(test === true) {
            action.removeAttribute('disabled');
        } else {
            action.setAttribute('disabled', '');
        }
    });
})
// Import
import {navActive, check, check2} from './module.js'

// beri kelas aktif pada nav sesuai dengan url sekarang
navActive();


document.addEventListener('click', function(event){
    if(event.target.id == 'action') {
        let formElement = document.querySelector('.container-fluid form');
        let form = new FormData(formElement);

        // Lakukan request
        fetch(`${window.location.pathname}`, {
            method : 'post',
            body: form
        }).then(check)
          .then(check2)
    }
});
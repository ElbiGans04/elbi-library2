import { validate, validateEmail } from '/assets/javascript/module.js';
const submit = document.querySelector('button[type=submit]');
const formElement = document.querySelector('form.user');
const formLogin = formElement.getAttribute('action');
const alertElement = document.getElementById('alert');
const modalCustom = document.querySelector('.modal-custom');
let inputButton = document.querySelectorAll('form .form-group input');

submit.addEventListener('click', function(event){
    // Beri supaya tidak mengirim
    event.preventDefault();
    
    // Check Validasi
    let test = check(inputButton);

    // Jika semua input valid
    if( test === true ) {

        // Tambahkan efek loading
        modalCustom.style.display = 'flex';

        // Buat form dan lakukan request
        const form = new FormData(formElement);
        fetch(formLogin, {
            method: 'POST',
            body: form, 
        })
            .finally(result => {
                modalCustom.style.display = 'none'
            })
            .then(result => {
                if(!result.ok) {
                    alert(result.statusText)
                    return false
                } else {
                    return result.json()
                }
            })
            .then(result => {
                if(result) {
                    let { message, redirect, type, delay } = result;
                    let text = message;
                    let alertClass = type ? 'alert-success' : 'alert-danger';
                    $(alertElement).removeClass('d-none alert-success alert-danger').addClass(alertClass);
                    if(delay) text += `<strong>${delay} second</strong>`;
                    alertElement.innerHTML = text
                    if(redirect && delay) {
                        let i = 0
                        setInterval(function(){
                            if(i < delay) {
                                delay--
                                alertElement.innerHTML = `${message} <strong>${delay} second</strong>`;
                            } else {
                                clearInterval()
                                window.location = `${redirect}`
                            }
    
                        }, 1000)
                    }
                }
            })
    } else {
      inputButton[test].focus()
    }
    

});

inputButton.forEach(function(e){
  let type = e.getAttribute('type');
  if(type !== 'checkbox') {
    e.addEventListener('keyup', function(event){
      if(check(inputButton) === true) {
        submit.removeAttribute('disabled')
      }
    })
  }
})



function check (element) {

  // Definisi Index
  let index = 0;

  // Melooping input element
  for (let el of element) {

    // Mengambil Data yang diperlukan
    let type = el.getAttribute('type');
    let name = el.getAttribute('name');
    let small = el.nextElementSibling;

    // Pastikan element input bukan type checkbox
    if (type !== 'checkbox') {

      // Jika Input Type Email maka gunakan validate type email
      let test = type == 'email' ? validateEmail(el.value) : validate(el.value);

      // Jika ada input yang tidak diisi atau yang tidak lolos regex maka return false, 
      // tampilkan element small, dan setel button submit ke false
      if(el.value.length <= 0 || !test) {
        small.classList.remove('d-none');
        small.textContent = `${name} is invalid`;
        submit.setAttribute('disabled', '')

        // Kembalikan Index sebagai penanda input ke berapa yang tidak valid
        return index
      
      // Jika ada element yang lolos maka hilangkan pesan kesalahan errornya
      } else {
        small.classList.add('d-none')
      }
    
    }


    // Tambahkan Index setiap looping
    index++

  }

  // Jika sudah sampai sini maka berarti semua input telah lolos test dan return true
  return true

}
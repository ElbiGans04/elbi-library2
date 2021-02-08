const submit = document.querySelector('button[type=submit]');
const formElement = document.querySelector('form.user');
const formLogin = formElement.getAttribute('action');
const alertElement = document.getElementById('alert');
const modalCustom = document.querySelector('.modal-custom');
let inputButton = document.querySelectorAll('form .form-group input');

submit.addEventListener('click', function(event){
    event.preventDefault();
    
    if(check(inputButton)) {
        modalCustom.style.display = 'flex';
        console.log("HI")
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
    }
    // Buat Object Form

});

inputButton.forEach(function(e){
  let type = e.getAttribute('type');
  if(type !== 'checkbox') {
    e.addEventListener('keyup', function(event){
      if(check(inputButton)) {
        submit.removeAttribute('disabled')
      }
    })
  }
})

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validate(text) {
  let regex = /^[a-zA-Z0-9]*$/
  return regex.test(text)
}

function check (element) {
  
  for (let el of element) {
    let type = el.getAttribute('type');
    let name = el.getAttribute('name');
    let small = el.nextElementSibling;

    // Pastikan bukan checkbox
    if (type !== 'checkbox') {
      let test = type == 'email' ? validateEmail(el.value) : validate(el.value);
      if(el.value.length <= 0 || !test) {
        small.classList.remove('d-none');
        small.textContent = `${name} is invalid`;
        // el.focus();
        submit.setAttribute('disabled', '')
        return false
      } else {
        small.classList.add('d-none')
    }
    
    }
  }

  return true

}
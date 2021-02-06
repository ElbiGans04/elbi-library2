const submit = document.querySelector('button[type=submit]');
const formElement = document.querySelector('form.user');
const formLogin = formElement.getAttribute('action');
const alertElement = document.getElementById('alert');
const modalCustom = document.querySelector('.modal-custom');

submit.addEventListener('click', function(event){
    console.log("masuk bos")
    event.preventDefault();
    modalCustom.style.display = 'flex';

    // Buat Object Form
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

});
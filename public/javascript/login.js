const submit = document.querySelector('button[type=submit]');
const formElement = document.querySelector('form.user');
const formLogin = formElement.getAttribute('action');
const alertElement = document.getElementById('alert');

submit.addEventListener('click', function(event){
    event.preventDefault();

    // Buat Object Form
    const form = new FormData(formElement);
    fetch(formLogin, {
        method: 'POST',
        body: form, 
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
                let alertClass = type ? 'alert-success' : 'alert-danger';
                $(alertElement).removeClass('d-none alert-success alert-danger').addClass(alertClass);
                alertElement.innerHTML = `${message} ${delay} second`;
                if(redirect && delay) {
                    let i = 0
                    setInterval(function(){
                        if(i < delay) {
                            delay--
                            alertElement.innerHTML = `${message} ${delay} second`;
                        } else {
                            clearInterval()
                            window.location = `${redirect}`
                        }

                    }, 1000)
                }
            }
        })
});
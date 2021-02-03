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
                const { message, redirect, type } = result;
                const alertClass = type ? 'alert-success' : 'alert-danger';
                $(alertElement).removeClass('d-none alert-success alert-danger').addClass(alertClass);
                alertElement.innerHTML = message;
                if(redirect) {
                    setTimeout(function(){
                        window.location = `${redirect}`
                    }, 3000)
                }
            }
        })
});
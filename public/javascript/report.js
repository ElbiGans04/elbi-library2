import {check, navActive} from '/assets/javascript/module.js';
const transaksi = document.querySelector('#idTransaction');
const modalCustom = document.querySelector('.modal-custom');
const information = document.querySelector('#information');
const user = document.querySelector('.user');
const book = document.querySelector('.book');
const total = document.querySelector('.price');


// Buat agar aktif
navActive()

// Event
transaksi.addEventListener('keyup', function(event){
    modalCustom.style.display = 'flex';

    fetch(`${window.location.pathname}/${this.value}`)
        .finally(res => modalCustom.style.display = 'none')
        .then(result => check(result))
        .then(result => {
            information.classList.remove('d-none');
            user.textContent = result.data.user_id.name;
            user.setAttribute('data-id', result.data.user_id.id)
            book.textContent = result.data.book_id.name;
            book.setAttribute('data-id', result.data.book_id.id)
            total.textContent = result.data.book_id.price
        })
});


const action = document.getElementById('action');
action.addEventListener('click', function(event){
    const form = new FormData();
    form.append('id', transaksi.value);
    form.append('user', user.dataset.id);
    form.append('book', book.dataset.id);
    if(!information.classList.contains('d-none')) {
        fetch(`${window.location.pathname}`, {method: 'post', body: form})
            .then(result => check(result))
            .then(result => {
                alert(result.message);
                if(result.type) window.location.reload()
            })
    }
})
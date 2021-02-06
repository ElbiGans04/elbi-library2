import {getTime} from './module.js'
const action = document.getElementById('buttonAction');
const formElement = document.querySelector('.container-fluid form');
const formData = new FormData(formElement);
const tableInformation = document.querySelectorAll('#information table tbody tr');

action.addEventListener('click', function(event){
    fetch('/rent', {
        method: 'delete',
        body: formData
    })
        .then(result => result.json())
        .then(result => alert(result.message))
});

const selectMember = document.querySelector('.container-fluid form select[name=member]');
const selectBook = document.querySelector('.container-fluid form select[name=book]');
const transaksi = document.querySelector('.container-fluid form input[readonly]');

selectMember.addEventListener('change', function(event){
    const value = this.value;
    fetch(`/rent/return/${value}`)
        .then(result => result.json())
        .then(result => {
            let option = ``
            // Perbaharui Select book
            result.forEach(function(e){
                let {id, title} = e.book_id;
                option += `<option value="${id}" data-transaction="${e.id_transaction}">${title}</option>`
            }) 
            selectBook.innerHTML = option;
            transaksi.setAttribute('value', result[0].id_transaction)
            updateDisplay()
        });
});

function updateDisplay () {
    const selectMemberVal = selectMember.value;
    const selectBookVal = selectBook.value;
    const inputVal = transaksi.value;
}

// Book
selectBook.addEventListener('change', function(event){
    let optionSelect = this.children[this.options.selectedIndex];
    let id = optionSelect.dataset.transaction;
    let price = optionSelect.dataset.price;
    let date = optionSelect.dataset.date;
    let day = optionSelect.dataset.day;
    let fines = optionSelect.dataset.fines;


    // Logic
    let {days} = getTime(date);
    if(days < 0) days = 0
    let denda = days * fines;
    let fee = price * day;
    let total = parseInt(fee) + parseInt(denda);

    // Implen
    $(tableInformation).children('td.fee').html(price)
    $(tableInformation).children('td.feeDay').html(`${day} Day`)
    $(tableInformation).children('td.fines').html(fines)
    $(tableInformation).children('td.finesDay').html(`${days} Day`)
    $(tableInformation).children('td.feeFInes').html(`${fee} + ${denda}`)
    $(tableInformation).children('td.total').html(`Rp. ${total}`)

    transaksi.setAttribute('value', id)
})
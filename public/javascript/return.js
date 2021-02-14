import {check, getTime, navActive} from './module.js'
const tableInformation = document.querySelectorAll('#information table tbody tr');
const action = document.getElementById('buttonAction');


// Beri kelas kepada nav yang aktif
navActive()



if(action) {
    action.addEventListener('click', function(event){
        const formElement = document.querySelector('.container-fluid form');
        const formData = new FormData(formElement);
        fetch('/rent', {
            method: 'delete',
            body: formData
        })
            .then(result => check(result))
            .then(result => alert(result.message))
    });




    // Event
    // 
    const selectUser = document.querySelector('.container-fluid form select[name=user]');
    const selectBook = document.querySelector('.container-fluid form select[name=book]');
    const transaksi = document.querySelector('.container-fluid form input[readonly]');
    
    selectUser.addEventListener('change', function(event){
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

}    


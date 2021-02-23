import { check, check2, getTime, navActive } from "./module.js";
const tableInformation = document.querySelectorAll("#information table tbody tr");
const action = document.getElementById("buttonAction");
const modalCustom = document.querySelector('.modal-custom');

// Beri kelas kepada nav yang aktif
navActive();

if (action) {
  action.addEventListener("click", function (event) {
    const formElement = document.querySelector(".container-fluid form");
    modalCustom.style.display = 'flex'
    const formData = new FormData(formElement);
    let url = `${window.location.pathname}`;
  
    fetch(url, {
      method: "post",
      body: formData,
    })
      .finally(result => modalCustom.style.display = 'none')
      .then(check)
      .then(check2);
  });

  // Event
  //
  const selectUser = document.querySelector(
    ".container-fluid form select[name=user]"
  );
  const selectBook = document.querySelector(
    ".container-fluid form select[name=book]"
  );
  const transaksi = document.querySelector(
    ".container-fluid form input[readonly]"
  );

  selectUser.addEventListener("change", function (event) {
    const value = this.value;
    modalCustom.style.display = 'flex'
    fetch(`/rent/return/${value}`)
      .finally(res => modalCustom.style.display = 'none')
      .then(check)
      .then((result) => {
        if(result.type === true) {
          let option = ``;
          // Perbaharui Select book
          result.forEach(function (e) {
            let { id, title } = e.book_id;
            option += `<option value="${id}" data-transaction="${e.id_transaction}" data-price="${e.order_price}" data-day="${e.order_day}" data-fines="${e.book_id.fines}" data-date="${e.order_date}">${title}</option>`;
          });
          selectBook.innerHTML = option;
  
          transaksi.setAttribute('value', result[0].id_transaction)
   
  
          let { days } = getTime(result[0].order_date, result[0].order_day);
          if (days < 0) days = 0;
          let denda = days * result[0].book_id.fines;
          let fee = result[0].order_price * result[0].order_day;
          let total = parseInt(fee) + parseInt(denda);
  
  
          $(tableInformation).children("td.fee").html(result[0].order_price);
          $(tableInformation).children("td.feeDay").html(`${result[0].order_day} Day`);
          $(tableInformation).children('td.fines').html(`${result[0].book_id.fines}`)
          $(tableInformation).children("td.finesDay").html(`${days} Day`);
          $(tableInformation).children("td.feeFInes").html(`${fee} + ${denda}`);
          $(tableInformation)
            .children("td.total")
            .html(`<strong>Rp. ${total}</strong>`);
        } else alert(result.message)
      });
  });
  // Book
  selectBook.addEventListener("change", function (event) {
    let optionSelect = this.children[this.options.selectedIndex];
    let id = optionSelect.dataset.transaction;
    let price = optionSelect.dataset.price;
    let date = optionSelect.dataset.date;
    let day = optionSelect.dataset.day;
    let fines = optionSelect.dataset.fines;

    // Logic
    let { days } = getTime(date, day);
    if (days < 0) days = 0;
    let denda = days * fines;
    let fee = price * day;
    let total = parseInt(fee) + parseInt(denda);

    // Implen
    $(tableInformation).children("td.fee").html(price);
    $(tableInformation).children("td.feeDay").html(`${day} Day`);
    $(tableInformation).children("td.fines").html(fines);
    $(tableInformation).children("td.finesDay").html(`${days} Day`);
    $(tableInformation).children("td.feeFInes").html(`${fee} + ${denda}`);
    $(tableInformation)
      .children("td.total")
      .html(`<strong>Rp. ${total}</strong>`);

    transaksi.setAttribute("value", id);
  });
}

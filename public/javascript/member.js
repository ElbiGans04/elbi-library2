import {check} from './module.js'
const url = window.location.pathname;
const tableUtama = document.getElementById("tableUtama");

// Memberi class active pada navbar
const nav = document.querySelector('ul#accordionSidebar');
const navActive = nav.getAttribute('navbaractive');
const navList = document.querySelectorAll('#accordionSidebar > li');
navList.forEach(function(element, index){
  if(element.getAttribute('name') == navActive) {
    element.classList.add(`active`)
  }
});


/// Datatables inisialisasi // // // 
$(tableUtama).DataTable({
  columnDefs: [{ orderable: false, targets: 2 }],
});
/// Akhir Datatables inisialisasi // // // 



// // // Add Modal // // //
$("#addMemberButton").on("click", function (event) {
  event.preventDefault();

  const formElement = $("#addModal .modal-body form")[0];
  const form = new FormData(formElement);

  fetch(url, {
    method: "post",
    body: form,
  })
    .then((result) => check(result))
    .then((result) => {
      if (result) {
        const { message, redirect, type } = result;
        alert(message);
        window.location.reload();
      }
    });
});
// // // Akhir Add Modal // // // 


// // // Edit Modal // // //
const tombolEdit = document.querySelectorAll(
  "#tableUtama > tbody > tr > td:last-child > .buttonActionEdit"
);
$(tombolEdit).on("click", function (event) {
  const row = this.parentElement.parentElement;
  const id = row.dataset.id;
  const form = document.querySelector(
    "#editModal > .modal-dialog > .modal-content > .modal-body > form"
  );
  form.setAttribute("data-id", id);
  const formInput = document.querySelectorAll(
    "#editModal > .modal-dialog > .modal-content > .modal-body > form > .form-group > input"
  );

  fetch(`${url}/${id}`)
    .then((result) => check(result))
    .then((result) => {
      const { data } = result;
      formInput.forEach(function (e) {
        const name = e.getAttribute("name");
        e.value = data[name];
      });
    });
});

const tombolEditModal = document.getElementById("EditMemberButton");
tombolEditModal.addEventListener("click", function (event) {
  const formElement = document.querySelector(
    "#editModal > .modal-dialog > .modal-content > .modal-body > form "
  );
  const id = formElement.dataset.id;

  const form = new FormData(formElement);
  fetch(`${url}/${id}`, {
    method: "put",
    body: form,
  })
    .then((result) => check(result))
    .then((result) => {
      if (result) {
        const { message, redirect, type } = result;
        alert(message);
        window.location.reload();
      }
    });
});

// // // Akhir Dari edit modal // // // 














// // // Delete Modal // // // 
const tombolDelete = document.querySelectorAll(
  "#tableUtama > tbody > tr > td:last-child > .buttonActionDelete"
);
$(tombolDelete).on("click", function (event) {
  const row = this.parentElement.parentElement;
  const id = row.dataset.id;

  const modal = document.querySelector(
    "#deleteModal > .modal-dialog > .modal-content > .modal-body"
  );
  modal.setAttribute("data-id", id);
  modal.innerHTML = "Are you sure you want to delete the member?";
});

const tombolDeleteModal = document.getElementById("deleteMemberButton");
tombolDeleteModal.addEventListener("click", function (event) {
  event.preventDefault();
  const modalBody = document.querySelector(
    "#deleteModal > .modal-dialog > .modal-content > .modal-body"
  );
  const id = modalBody.dataset.id;
  fetch(`${url}/${id}`, {
    method: "delete",
  })
    .then((result) => check(result))
    .then((result) => {
      if (result) {
        const { message, redirect, type } = result;
        alert(message);
        window.location.reload();
      }
    });
});

// // // Akhir dari delete modal // // //
import {check} from './module.js'
const url = window.location.pathname;
const tableUtama = document.getElementById("tableUtama");
const columnLength = tableUtama.children[0].children[0].children.length - 1;

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
if(navActive == 'member') {
  var t = $('#tableUtama').DataTable( {
      "columnDefs": [ {
          "searchable": false,
          "orderable": false,
          "targets": [0, 3]
      } ],
      "order": [[ 1, 'asc' ]]
  } );
  
  t.on( 'order.dt search.dt', function () {
      t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
          cell.innerHTML = i+1;
      } );
  } ).draw();
} else if ('book') {
  function format ( d ) {
    return `Publisher: ${d[5]}<br> Page Thickness: ${d[6]}<br> Isbn: ${d[7]}`
}
  var dt = $('#tableUtama').DataTable( {
      columnDefs: [
        {
          searchable: false,
          orderable: false,
          targets: 0,
          class: "details-control",
          defaultContent: "",
        },
        {
          searchable: false,
          orderable: false,
          targets: [columnLength],
        },
        {
          visible: false,
          targets: [5,6,7]
        }
      ],
      order: [[1, "asc"]],
  } );
  
  // Array to track the ids of the details displayed rows
  var detailRows = [];
  $('#tableUtama tbody').on( 'click', 'tr td.details-control', function () {
      // Mencari Baris
      var tr = $(this).closest('tr');
      // Mendapatkan Datatables API
      var row = dt.row( tr );
      
      // Check Apakah baris sudah dibuka
      var idx = $.inArray( tr.attr('id'), detailRows );

      if ( row.child.isShown() ) {
          tr.removeClass( 'details' );
          row.child.hide();

          // Remove from the 'open' array
          detailRows.splice( idx, 1 );
      }
      else {
          tr.addClass( 'details' );
          row.child( format( row.data() ) ).show();

          // Add to the 'open' array
          if ( idx === -1 ) {
              detailRows.push( tr.attr('id') );
          }
      }
  } );

  // On each draw, loop over the `detailRows` array and show any child rows
  dt.on( 'draw', function () {
      $.each( detailRows, function ( i, id ) {
          $('#'+id+' td.details-control').trigger( 'click' );
      } );
  } );
}
/// Akhir Datatables inisialisasi // // // 



// // // Add Modal // // //
$("#addButton").on("click", function (event) {
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

const tombolEditModal = document.getElementById("EditButton");
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

const tombolDeleteModal = document.getElementById("deleteButton");
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
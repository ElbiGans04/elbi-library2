import {check} from './module.js'
let url = window.location.pathname;
const tableUtama = document.getElementById("tableUtama");
const columnLength = tableUtama.children[0].children[0].children.length - 1;

// // // Memberi class active pada navbar \\ \\ \\ 
const nav = document.querySelector('ul#accordionSidebar');
const navActive = nav.getAttribute('navbaractive');
const navList = document.querySelectorAll('#accordionSidebar > li');

navList.forEach(function(element, index){
  const children = element.children;
  let url = window.location.pathname.split('/');

  // Jika 2 slash
  if(url.length > 2) {
    let newUrl = `/${url[url.length - 1]}`;
    if(newUrl == '/') newUrl = `/${url[url.length - 2]}`;
  } else {
    // Ambil Url lagi
    url = window.location.pathname;
  }

  // Jika mempunyai 2 element anak berarti nav collaps
  if( children.length > 1 ) {
    const anak = children[children.length - 1];

    // Jika mempunyai class
    if(anak.matches('.collapse')) {
      const cicit = anak.children[0].children;
      
      // Lakukan Pengulangan
      for ( let el of cicit ) {
        if( el.getAttribute('href') ==  url ) {
          anak.classList.add('show')
          element.classList.add('active')
          el.classList.add('active')
        }
      }
    }

  } else {
    const anak = element.children[0];
    if(anak.getAttribute('href') == url) element.classList.add('active');
  }
});

/// Datatables inisialisasi // // // 
if(navActive == 'user' || navActive == 'order') {
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
} else if (navActive == 'book') {
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
          targets: [1, columnLength],
        },
        {
          visible: false,
          targets: [6,7,8]
        }
      ],
      order: [[3, "asc"]],
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
$(document).on('click', '#addActionButton', function(event){
  $('#addModal').modal('show')
});
$(document).on("click", '#addButton', function (event) {
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
        console.log(result)
        const { message, redirect, type } = result;
        alert(message);
        if(type) window.location.reload();
      }
    });
});
// // // Akhir Add Modal // // // 














// // // Edit Modal // // //

$(document).on("click",'.buttonActionEdit', function (event) {
  $('#editModal').modal('show');
  const row = $(event.target).closest('tr')[0];
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
        const type = e.getAttribute('type');
        const name = e.getAttribute("name");
        const value = data[name]
        
        if(type == 'file') {
          const img = e.parentElement.children[0];
          img.setAttribute('src', `data:image/${result['book_type']};base64,${value}`)
          
        } else {
          e.value = value;
        }
      });
    });
});

$(document).on('click', `#EditButton`, function (event) {
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
        // window.location.reload();
      }
    });
});


// Event Ketika User Mengupload
$(document).on('change', '#inputUpdateImage, #inputAddImage', function(event){
  const gambar = this.parentElement.children[0];
  console.log('check')
  const file = this.files[0];
  const read = new FileReader();
  read.readAsDataURL(file);
  read.onload = () => {
    gambar.setAttribute('src', read.result)
  }
});

// // // Akhir Dari edit modal // // // 














// // // Delete Modal // // // 
const tombolDelete = document.querySelectorAll(
  "#tableUtama > tbody > tr > td:last-child > .buttonActionDelete"
);
$(document).on("click", '.buttonActionDelete', function (event) {
  $('#deleteModal').modal('show')
  const row = $(event.target).closest('tr')[0];
  const col = $(row).children('[data-as=identifer]')[0]
  const id = row.dataset.id;
  const modal = document.querySelector(
    "#deleteModal > .modal-dialog > .modal-content > .modal-body"
  );
  modal.setAttribute("data-id", id);
  modal.innerHTML = `Are you sure you want to delete <strong>${col.textContent}?</strong>`;
});

$(document).on("click", '#deleteButton', function (event) {
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








// Menonaktifkan event enter pada element input form 
const formControl = document.querySelectorAll('.form-control');
formControl.forEach( function ( element ) {
  element.addEventListener('keypress', function (event){
    const code = event.keyCode;
    if ( code === 13 ) {
      event.preventDefault();
      return false
    }
  })
})
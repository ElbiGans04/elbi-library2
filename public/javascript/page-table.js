import {check, check2, getIndex, getRows, navActive, validasi} from './module.js'
let url = window.location.pathname;
const tableUtama = document.getElementById("tableUtama");
const columnLength = tableUtama.children[0].children[0].children.length - 1;
const nav = document.querySelector('ul#accordionSidebar');
const all = getRows();
const modalCustom = document.querySelector('.modal-custom');
let showGroup = document.getElementById('showGroup')

// Beri kelas pada nav yang aktif
navActive()

// Hilangkan Url ? 
let newUrl = window.location.href.split('?');
window.history.pushState({}, 'Elbi Library', newUrl[0])
if(newUrl[1]) if(newUrl[1].indexOf('group') !== -1) showGroup.value = newUrl[1].split('=')[1] || 0;


// console.log($('#addModal .modal-body form input'))
/// Datatables inisialisasi // // // 
let jajal = nav.querySelector('.active');
let active = jajal.dataset.show || 1;

if(active == 1) {
  var t = $('#tableUtama').DataTable( {
    "columnDefs": [ {
      "searchable": false,
      "orderable": false,
      "targets": [0, columnLength]
      } ],
      "order": [[ 1, 'asc' ]]
  } );
  
  t.on( 'order.dt search.dt', function () {
      t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
        cell.innerHTML = i+1;
      } );
  } ).draw();
} else {
  function format ( d, i ) {
    let result = '';
    // Ambil Rows saat ini
    let newRows = getRows()[i];
    
    for(let idx in d[i]) {
      if(!newRows[idx]) {
       result += `${idx}: ${d[i][idx]} <br>`
      }
    }
    
    
    return result
  }
  let targets = active == 2 ? [3,7,8,9,10] : [3, 4, 6, 7];

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
          targets,
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
      let index = getIndex(tr[0]);
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
          row.child( format( all, index ) ).show();

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
// /// Akhir Datatables inisialisasi // // // 



// // // Add Modal // // //
$(document).on('click', '#addActionButton', function(event){
  $('#addModal').modal('show')
});
$(document).on("click", '#addButton', function (event) {
  event.preventDefault();
  let allInput = this.parentElement.previousElementSibling.querySelectorAll('input');
  
  let test = validasi(allInput, this);
  if(test === true) {
    const formElement = $("#addModal .modal-body form")[0];
    const form = new FormData(formElement);
    modalCustom.style.display = `flex`;
  
    fetch(url, {
      method: "post",
      body: form,
    })
      .finally(result => modalCustom.style.display = 'none')
      .then(check)
      .then(check2);
  } else {
    this.setAttribute('disabled', '')
  }
});
// // // Akhir Add Modal // // // 














// // // Edit Modal // // //

$(document).on("click",'.buttonActionEdit', function (event) {
  $('#editModal').modal('show');
  modalCustom.style.display = 'flex';
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
    .finally(result => modalCustom.style.display = 'none')
    .then(check)
    .then((result) => {
      const { data, type } = result;
      if(type === true) {
        formInput.forEach(function (e) {
          const type = e.getAttribute('type');
          const name = e.getAttribute("name");
          const show = e.dataset.show;
          const value = data[name]
          
  
          // Jika off
          if(show == 'on') {
            if(type == 'file') {
              const img = e.parentElement.children[0];
              img.setAttribute('src', `data:image/${result['book_type']};base64,${value}`)
              
            } else {
              e.value = value;
            }
          }
          
        });
      } else alert(result.message)
    });
});

$(document).on('click', `#EditButton`, function (event) {
  const formElement = document.querySelector(
    "#editModal > .modal-dialog > .modal-content > .modal-body > form "
    );
    const inputElement = formElement.querySelectorAll('input');
    let test = validasi(inputElement, this)
    if(test === true) {
      modalCustom.style.display = 'flex'
      const id = formElement.dataset.id;
      
      const form = new FormData(formElement);
      fetch(`${url}/${id}`, {
        method: "put",
        body: form,
      })
      .finally(result => modalCustom.style.display = 'none')
      .then(check)
      .then(check2);

  } else {
    this.setAttribute('disabled', '')
  }
});


// // // Akhir Dari edit modal // // // 














// // // Delete Modal // // // 
$(document).on("click", '.buttonActionDelete', function (event) {
  $('#deleteModal').modal('show')
  const row = $(event.target).closest('tr')[0];
  const col = $(row).children('[data-as=identifer]')[0]
  const id = row.dataset.id;
  const modal = document.querySelector(
    "#deleteModal > .modal-dialog > .modal-content > .modal-body"
  );
  modal.setAttribute("data-id", id);
  modal.innerHTML = `Are you sure you want to delete <strong>${col == undefined ? 'this' : col.textContent}?</strong>`;
});

$(document).on("click", '#deleteButton', function (event) {
  event.preventDefault();
  const modalBody = document.querySelector(
    "#deleteModal > .modal-dialog > .modal-content > .modal-body"
  );
  modalCustom.style.display = 'flex'
  
  const id = modalBody.dataset.id;
  fetch(`${url}/${id}`, {
    method: "delete",
  })
  .finally(result => modalCustom.style.display = 'none')
    .then(check)
    .then(check2);
});

// // // Akhir dari delete modal // // //








// Menonaktifkan event enter pada element input form 
const formControl = document.querySelectorAll('.modal-body form .form-control');
formControl.forEach( function ( element ) {
  element.addEventListener('keypress', function (event){
    const code = event.keyCode;
    if ( code === 13 ) {
      event.preventDefault();
      return false
    }
  });

});


// memberi event validasi

let formControlAdd = document.querySelectorAll('#addModal .modal-body form input');
let formControlEdit = document.querySelectorAll('#editModal .modal-body form input');
eventValidasi(formControlAdd)
eventValidasi(formControlEdit)

function eventValidasi(formControl) {
  formControl.forEach(function(element, index){
    element.addEventListener('keyup', function(event){
      let footer = this.parentElement.parentElement.parentElement.nextElementSibling.children;
      let button = footer[footer.length - 1];
      let test = validasi(formControl, button);
      
      // Jika true
      if(test === true) {
        button.removeAttribute('disabled');
      } else {
        button.setAttribute('disabled', '');
      }
  
    })
  });
};



// Event Image Modal
const imageModal = document.querySelectorAll('.image-modal');
const modal = document.getElementById('imageModal');
imageModal.forEach(function(element, index){
  element.addEventListener('click', function(event){
    const img = modal.children[0];
    modal.style.display = 'flex'
    // console.log(img)
    img.setAttribute('src', this.getAttribute('src'))
  })
});


// Event Close
modal.children[1].addEventListener('click', function(event){
  modal.style.display = 'none'
});


$(document).on('click', '#convertButton', function(event){
  let formElement = $(this).closest('.modal-footer').prev().children()[0];
  fetch(`/convert/${$('#convert').val()}`)
  .then(result => result.blob())
  .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = `ElbiLibrary-${Date.now()}.xlsx`;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();    
          a.remove(); 
    })
})



// Event Ketika Group Diganti
$(document).on('change', '#showGroup', function(event){
  modalCustom.style.display = 'flex';
  let url = window.location.pathname;
  window.location = `${url}?group=${this.value}`
});
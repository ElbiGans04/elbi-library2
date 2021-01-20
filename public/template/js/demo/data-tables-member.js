// Call the dataTables jQuery plugin
$(document).ready(function() {
  let table = $('#dataTable').DataTable({
    "columnDefs": [
      { "orderable": false, "targets": [0,6] }
    ], // jangan lupa tambahkan koma terlebih dahulu
    "order": [[2, 'asc']],
    // "bPaginate": false, untuk pagination
    // "bInfo": false, Untuk menonaktifkan showing info
    // "bLengthChange": false,
    // "bAutoWidth": false
    "oLanguage": {
      "sLengthMenu": "Show _MENU_",
    }
  });

  table.on( 'order.dt search.dt', function () {
    table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
        cell.innerHTML = i+1;
    } );
} ).draw();
});

$(document).ready(function(){
    $('#tbl-production-rollup').DataTable({
        "ordering": true,
        "select": true,
        "paging": true,
        "info": true,
        "pageLength": 25
    });

    $('#tbl-downtime-reasons').DataTable({
        "ordering": true,
        "select": true,
        "paging": true,
        "info": true,
        "pageLength": 10
    });
});

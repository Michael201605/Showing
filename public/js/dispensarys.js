/**
 * Created by pi on 9/17/16.
 */
$(function () {
    var dispensaryJobsDataTable = $('#disJobsTable').DataTable();
    var selected = [];
    $('#disJobsTable tbody').on('click', 'tr', function () {
        var id = this.id;
        var index = $.inArray(id, selected);

        if (index === -1) {
            selected.push(id);
        } else {
            selected.splice(index, 1);
        }
        console.log('id: ');
        console.log(selected);
        $(this).toggleClass('selected');
    });


});
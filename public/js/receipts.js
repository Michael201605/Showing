/**
 * Created by pi on 9/17/16.
 */
$(function () {
    var receiptsDataTable = $('#receiptsTable').DataTable();
    var selected = [];
    $('#newReceipt').click(function () {
        $.get('/order/receipt/createReceipt', function (data) {
            var newReceipt = null;
            console.log('data: ' + data);
            if (!data.error) {
                newReceipt = data.receipt;
                console.log('newProcessOrder: ' + newReceipt);
                console.log('newProcessOrder id: ' + newReceipt.id);
                console.log('newProcessOrder State: ' + newReceipt.displayState);
                var rowNode = receiptsDataTable.row.add([
                    '<a href="/order/receipt/receiptDetail/:' + newReceipt.id + '">' + newReceipt.ident + '</a>',
                    newReceipt.productIdent,
                    newReceipt.actualUnitSize,
                    newReceipt.packagingType
                ]).draw(false).node();
                $(rowNode).attr('id', newReceipt.id);

            } else {
                $('#errors').append('<li>' + data.error + '</li>');
            }

        });
    });
    $('#processOrdersTable tbody').on('click', 'tr', function () {
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
    $('#deleteReceipt').click(function () {
        $('#errors').empty();
        $('#infos').empty();
        if (selected.length > 0) {
            var toDeleteReceiptIdsStr = JSON.stringify(selected);
            console.log('toDeleteReceiptIdsStr: ' + toDeleteReceiptIdsStr);
            receiptsDataTable.row('.selected').remove().draw(false);
            $.post('/order/receipt/receiptList/deleteReceipt', {toDeleteReceiptIdsStr: toDeleteReceiptIdsStr}, function (data) {
                console.log(data);
                if (data.error) {
                    $('#errors').append('<li>' + data.error + '</li>');
                }
                if (data.info) {
                    $('#infos').append('<li>' + data.info + '</li>');
                }
            });
        } else {
            $('#errors').append('<li>No row selected</li>');
        }

    });

});
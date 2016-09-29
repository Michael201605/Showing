/**
 * Created by pi on 9/17/16.
 */
var barcodeText;
$(function () {
    var dispensaryJobsDataTable = $('#disJobsTable').DataTable();
    var stockDataTable = $('#stockTable').DataTable();
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
    $('#stockTable tbody').on('click', 'tr', function () {
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
    $(window).keypress(function (e) {
        if ((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122) || e.which == 95||e.which == 47) {
            chars.push(String.fromCharCode(e.which));
        }
        console.log(e.which + ":" + chars.join("|"));
        if (pressed == false) {
            setTimeout(function () {
                if (chars.length >= 10) {
                    barcodeText = chars.join("");
                    console.log("Barcode Scanned: " + barcodeText);
                    // assign value to some input (or do whatever you want)
                    $("#transferBarcode").val(barcodeText);
                    barcodeScanned(barcodeText);
                }
                chars = [];
                pressed = false;
            }, 500);
        }
        pressed = true;
    });
    $("#transferBarcode").keypress(function (e) {
        if (e.which === 13) {
            barcodeText = $(this).val();
            barcodeScanned(barcodeText);
            console.log("Barcode input: " + barcodeText);
        }
    });
    $('#confirmTransfer').click(function () {
        barcodeText = $('#transferBarcode').val();
        barcodeScanned(barcodeText);
    });
});


$("#barcode").keypress(function (e) {
    if (e.which === 13) {
        barcodeText = $(this).val();
        console.log("Barcode input: " + barcodeText);
    }
});

function barcodeScanned(barcode) {
    if(selectedProduct){
        if (barcode) {
            var segments;
            segments= barcode.split('_');
            if(segments.length==0){
                segments= barcode.split('/');
            }
            if(segments.length>0){
                if(segments[0] === selectedProduct){
                    $.get('/station/dispensary/scanBarcode/:location/:barcode', function (data) {
                        if(data.info){
                            $('#infos').append('<li>' + data.info + '</li>');
                        }
                        if(data.error){
                            $('#errors').append('<li>' + data.error + '</li>');
                        }
                        if(data.isScale === true){
                            var scaleLink = $('#navBar').find('a[href=#scale]');
                            var scaleTab =$(scaleLink).attr('data-toggle','pill').parent();
                            $(scaleTab).removeClass('disabled');
                            $(scaleLink).click();
                        }
                    });
                }else {
                    $('#errors').append('<li>Product ident is not correct, please take right product</li>');
                }
            }else {
                $('#errors').append('<li>No barcode found</li>');
            }

        }
    }else {
        $('#errors').append('<li>No product selected.</li>');
    }

}
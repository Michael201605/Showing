/**
 * Created by pi on 8/30/16.
 */
$(document).ready(function() {
    var pressed = false;
    var chars = [];
    $(window).keypress(function(e) {
        if ((e.which >= 48 && e.which <= 57)||(e.which >= 65 && e.which <= 90)||(e.which >= 97 && e.which <= 122)||e.which ==95) {
            chars.push(String.fromCharCode(e.which));
        }
        console.log(e.which + ":" + chars.join("|"));
        if (pressed == false) {
            setTimeout(function(){
                if (chars.length >= 10) {
                    barcodeText = chars.join("");
                    console.log("Barcode Scanned: " + barcodeText);
                    // assign value to some input (or do whatever you want)
                    $("#barcode").val(barcodeText);
                }
                chars = [];
                pressed = false;
            },500);
        }
        pressed = true;
    });
});
var barcodeText;
$("#barcode").keypress(function(e){
    if ( e.which === 13 ) {
        barcodeText = $(this).val();
        console.log("Barcode input: " + barcodeText);
    }
});
function assemblyToJob(barcode) {
    
}
function onGetDevices(ports) {
    for(var i=0;i<ports.length; i++){
        console.log(ports[i].path);
    }
}
function setBKColor(state) {
    var color;
    switch (state) {
        case 10:
        case '10':
            //Error
            color = 'LightGreen';
            break;
        case 15:
        case '15':
            //Error
            color = 'Red';
            break;
        case 20:
        case '20':
            //Loading
            color = 'Green';
            break;
        case 80:
        case '80':
            //Suspended
            color = 'Silver';
            break;

    }
    $('#displayState').css({'background-color': color});
}


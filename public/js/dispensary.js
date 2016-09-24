/**
 * Created by pi on 8/30/16.
 */
var progressbarValue, barcodeText, progressbar, conn, cmd;
var selected;
$(function () {
    var pressed = false;
    var chars = [];
    progressbar = $("#progressbar");
    progressbar.progressbar({
        value: 20
    });
    progressbarValue = progressbar.find(".ui-progressbar-value");
    $(window).keypress(function (e) {
        if ((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122) || e.which == 95) {
            chars.push(String.fromCharCode(e.which));
        }
        console.log(e.which + ":" + chars.join("|"));
        if (pressed == false) {
            setTimeout(function () {
                if (chars.length >= 10) {
                    barcodeText = chars.join("");
                    console.log("Barcode Scanned: " + barcodeText);
                    // assign value to some input (or do whatever you want)
                    $("#barcode").val(barcodeText);
                }
                chars = [];
                pressed = false;
            }, 500);
        }
        pressed = true;
    });




    if (window["WebSocket"]) {
        conn = new WebSocket("ws://localhost:8989/ws");

        conn.onclose = function (evt) {
            $('#infos').append('<li>Connection closed.</li>');
        };
        conn.onmessage = function (evt) {
            //$('#infos').append('<li>' + evt.data + '</li>');
            showWeight(evt.data);
        };
        cmd = 'close COM1';
        setTimeout(function () {
            conn.send(cmd + "\n");
            cmd = 'open COM1 9600 tinyg';
            setTimeout(function () {
                conn.send(cmd + "\n");
            }, 250);
        }, 250);


    } else {
        ('#errors').append('<li>Your browser does not support WebSockets.</li>');
    }
    var toAssemblyDataTable = $('#toAssemblyTable').DataTable();
    var haveAssemblyedDataTable = $('#haveAssemblyedTable').DataTable();
    var stockDataTable = $('#stockTable').DataTable();
    $('#tare').click(function () {
        var actualWeight = $('#actualWeight').val();
        if($.isNumeric(actualWeight)){
            tareWeight += actualWeight;
            $('#actualWeight').val(0);
            progressbar.progressbar({value: 0});
        }
    })
    $('#scaleWeight').click(function () {
        progressbar.progressbar({max: 20});
        simulateScale(10);
    });
});

var tareWeight =0;
var simulatedValue=0;
function simulateScale(targetValue) {
    simulatedValue += 0.1;
    if(targetValue>simulatedValue){
        cmd = 'send COM1 ' + simulatedValue +'\n';
        if(conn){
            conn.send(cmd);
        }
        setTimeout(function () {
            simulateScale(targetValue);
        },300);
    }

}
$("#barcode").keypress(function (e) {
    if (e.which === 13) {
        barcodeText = $(this).val();
        console.log("Barcode input: " + barcodeText);
    }
});
function assemblyToJob(barcode) {

}

function barcodeScanned(barcode) {
    if(barcode){

    }
}

function showWeight(dataStr) {
    var data;
    var valueStr;
    var value;
    var length;
    try {
        data= $.parseJSON(dataStr);
        if(typeof data == 'object'){
            if (data.D) {
                if(Array.isArray(data.D)){
                    valueStr = data.D[0];
                    length= valueStr.length;
                    data = valueStr.substring(0,length-1);
                    value= parseFloat(data);
                    console.log('value: ' + value);
                    value = value -tareWeight;
                    if (progressbar) {
                        progressbar.progressbar({value: value})
                    }
                    $('#actualWeight').val(value);
                }else{
                    return;
                }






            }
        }
    }catch (ex)
    {

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


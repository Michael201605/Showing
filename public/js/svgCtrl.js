/**
 * Created by pi on 8/17/16.
 */
var GcObjectDialog, StorageDialog, ScaleDialog;
$(function () {
    //modal dialog------

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        // emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        // name = $( "#name" ),
        // email = $( "#email" ),
        // password = $( "#password" ),
        // allFields = $( [] ).add( name ).add( email ).add( password ),
        // tips = $( ".validateTips" );

    GcObjectDialog = $( "#GCObject-form" ).dialog({
        title: 'GcObject',
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            Cancel: function() {
                GcObjectDialog.dialog( "close" );
            }
        },
        close: function() {

        }
    });


    // form = dialog.find( "form" ).on( "submit", function( event ) {
    //     event.preventDefault();
    //     addUser();
    // });

    //-------------------------------

    //load svg file
    $('#home').load('svgImage/Start.svg');
    var navigations = JSON.parse($("#navigations").val());
    navigations.forEach(function (nav) {
        var url = 'svgImage/' + nav.index + '.svg';
        $('#' + nav.index).load(url);
    });


    //socket communication with server to update GCObject's state
    try
    {
        var socket = io('http://172.26.203.71:3000');
        socket.on('GCObjectUpdate', function (GCObjects) {
            // var GCObjects = JSON.parse(GCObjectsStr);
            console.log('has received event');
            console.dir(GCObjects);
            GCObjects.forEach(function (GCObject) {
                updateStatus(GCObject)
            });

        });
        socket.on('connect_timeout',function (data) {
            console.log('connect_timeout',data);
        });
        socket.on('error',function (data) {
            console.log('error',data);
        });
        socket.on('disconnect', function(){
            console.log('disconnected......');
        });

    }catch (ex){
        console.log('exception happened:',ex);
    }


});
function Storage(BinIdent) {
    if(BinIdent){
        var url = '/storage/StorageDetail/:' + BinIdent;
        var win = window.open(url, '_blank');
        win.focus();
    }else {
        alert('BIN Ident is empty');
    }

}
function Scale(Ident) {
    if(Ident){
        var url = '/scale/ScaleDetail/:' + Ident;
        var win = window.open(url, '_blank');
        win.focus();
    }else {
        alert('Scale Ident is empty');
    }

}
function GcObject(gcIdent) {
    console.log('ident: ' + gcIdent);

    $.get('/gcobject/:' + gcIdent,function (gcObject) {
        console.log('gcObejct:');
        console.dir(gcObject);
        GcObjectDialog.dialog('option', 'title','GcObject: ' +gcIdent);

        GcObjectDialog.data('gcObject', gcObject).dialog('open');

        setGcObjectButtons(gcObject);

        $('#Mannual').click(function () {
            gcObject.mode = 0;
            sendGcObjectToServer(gcObject);
        });
        $('#Aumatic').click(function () {
            gcObject.mode = 1;
            sendGcObjectToServer(gcObject);
        });
        $('#close').click(function () {
            gcObject.status = 0;
            sendGcObjectToServer(gcObject);
        });
        $('#Open').click(function () {
            gcObject.status = 1;
            sendGcObjectToServer(gcObject);
        });
    });

}
function sendGcObjectToServer(gcObject) {

    $.post('/gcobject',{gcObjectStr:JSON.stringify(gcObject)}, function (gcObject) {
        console.log('refresh gcObject: ');
        console.dir(gcObject);
        setGcObjectButtons(gcObject);
    });
}
function setGcObjectButtons(gcObject) {
    if(gcObject.mode){
        $('#Mannual').attr("disabled", false);
        $('#Aumatic').attr("disabled", true);
        $('#close').attr("disabled", true);
        $('#Open').attr("disabled", true);
        $('#mode').attr('fill', 'green');
    }else {
        $('#mode').attr('fill', 'grey');
        $('#Mannual').attr("disabled", true);
        $('#Aumatic').attr("disabled", false);
        if(gcObject.status){
            $('#close').attr("disabled", false);
            $('#Open').attr("disabled", true);
        }else {
            $('#close').attr("disabled", true);
            $('#Open').attr("disabled", false);
        }
    }
    if(gcObject.status){
        $('#status').attr('fill', 'green');
    }
    else {
        $('#status').attr('fill', 'grey');
    }

}
function updateStatus(GCObject) {
    var color = getColorByState(GCObject.State);
    setBKColor($('#' + GCObject.id), color);
}
function getColorByState(state) {
    var color = '';
    if ($.isNumeric(state)) {
        switch (state) {
            case 10:
                //passive
                color = 'grey';
                break;
            case 20:
                //running
                color = 'blue';
                break;
            case 30:
                //ready
                color = 'green';
                break;
            case 40:
                //error
                color = 'red';
                break;
            default:
                color = 'grey';
        }
    } else {
        switch (state) {
            case 'Passive':
                //passive
                color = 'grey';
                break;
            case 'Running':
                //running
                color = 'blue';
                break;
            case 'Ready':
                //ready
                color = 'green';
                break;
            case 'Error':
                //error
                color = 'red';
                break;
            default:
                color = 'grey';
        }
    }
    return color;
}
function setBKColor($node, color) {
    $node.children().attr('fill', color);
    $node.find('rect').attr('fill', color);
}
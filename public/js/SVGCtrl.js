/**
 * Created by pi on 8/17/16.
 */
$(function () {
    $('#home').load('SvgImage/Start.svg');
    var navigations = JSON.parse($("#navigations").val());
    navigations.forEach(function (nav) {
        var url = 'SvgImage/' + nav.index + '.svg';
        $('#' + nav.index).load(url);
    });

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
    }catch (ex){
        console.log('error happened:',ex);
    }

});
function pp()
{
    var width = screen.width;
    var height = screen.height;
    var someValue = window.showModalDialog("new.html","","dialogWidth="+width+"px;dialogHeight="+height+"px;status=no;help=no;scrollbars=no")
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
// $scope.A_1001_MXZ01 ={
//     Style: {
//
//         'background-color':'red'
//     }
// }
// $scope.Style = {'background-color':'blue'};
function setBKColor($node, color) {
    $node.children().attr('fill', color);
    $node.find('rect').attr('fill', color);
}
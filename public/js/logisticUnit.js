/**
 * Created by pi on 8/30/16.
 */
$(function () {

});

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


/**
 * Created by pi on 8/25/16.
 */
var fs = require('fs');
var path = require('path');
var logfile = 'FLCos.txt';
var prefix = 'FLCos';
var basePath = path.join(__dirname, '../../log');
var wstream;
//fs.createWriteStream(logfile);
fs.exists(basePath, function (isExisted) {
    if (!isExisted) {
        fs.mkdir(basePath);
    }

});
var getFullFileName = function () {
    var fileName = '';
    var theTime = new Date();
    var theYear = theTime.getYear();
    var theMonth = theTime.getMonth();
    var theDay = theTime.getDay();
    var theHour = theTime.getHours();
    fileName = basePath + '/' + prefix + '-' + theYear + '-' + theMonth + '-' + theDay + '-' + theHour + '.log';
    console.log('fileName: ' + fileName);
    return fileName;
};
var log = function (data, i18n) {

    var fullFileName = getFullFileName();
    console.log('type: ' + typeof (data));
    if(typeof (data) === 'object'){
        data = JSON.stringify(data);
    }
    if(typeof (data) === 'function'){
        data = data.toString();
    }
    fs.appendFile(fullFileName, data, function (err) {
        if(err){
            console.log('append file: ' + err);
        }

    });
    console.log(data);

};
module.exports = log;
module.exports.getFullFileName = getFullFileName;
function _getLogText(data, type) {
    if(typeof (data) === 'object'){
        data = JSON.stringify(data);
    }
    if(typeof (data) === 'function'){
        data = data.toString();
    }
    if(!type){
        type = 'D';
    }
    var time = new Date().toLocaleString();
    return time + ': [' + type + ']: ' + data + '\n';
}
module.exports.debug = function (data) {
    log(_getLogText(data, 'D'));
};
module.exports.info = function (data, i18n) {
    log(_getLogText(data, 'I'));
};
module.exports.error = function (data, i18n) {
    log(_getLogText(data, 'E'));
};
module.exports.warn = function (data, i18n) {
    var time = new Date().toLocaleString();
    log(_getLogText(data, 'W'));
};

/**
 * Created by pi on 7/19/16.
 */
// var _ = require('underscore');
// var theList = [1, 2, 3, 4, 5, 6];
//
// function findEven(num) {
//     var result = num % 2 == 0;
//     console.log('num: {0}, result: {1}', num, result);
//     return result;
// }
// // var even = _.find(theList, findEven);
// var evens = _.each(theList, findEven);
// // console.log('even: ' + even);
// console.log('evens: ' + evens.toString());

// (function() {
//     var childProcess = require("child_process");
//     var oldSpawn = childProcess.spawn;
//     function mySpawn() {
//         console.log('spawn called');
//         console.log(arguments);
//         var result = oldSpawn.apply(this, arguments);
//         return result;
//     }
//     childProcess.spawn = mySpawn;
// })();
var Printer = require('node-printer');
var options = {
    media: 'Custom.200x600mm',
    n: 3
};
var printers = Printer.list();
var fs = require('fs');


var toArray = require('stream-to-array');


console.log('printers: ' + JSON.stringify(printers));

var printer = new Printer('HP-LaserJet-5200-2');
var stream = require('stream');
// Print from a buffer, file path or text
// var fileBuffer = fs.readFileSync('/path/to/file.ext');
// var jobFromBuffer = nodeprinter.printBuffer(fileBuffer);
//
// var filePath = 'package.json';
// var jobFromFile = nodeprinter.printFile(filePath);

var text = 'Print text directly, when needed: e.g. barcode printers';

var barcode = require('barcode');
// console.log('barcode is OK: ' + barcode);
var code39 = barcode('code39', {
    data: "it works",
    width: 400,
    height: 100,
});
// console.log('code39 is OK: ' + code39);
var path = require('path');
// var arr = [61,62,63,64,65,66];
// var buffeToPrint = new Buffer(arr);
// console.log('buffeToPrint Is buffer: ' + (buffeToPrint instanceof Buffer));
// var jobFromBuffer = printer.printBuffer(buffeToPrint);
// jobFromBuffer.once('sent', function () {
//     jobFromBuffer.on('completed', function () {
//         console.log('Job ' + jobFromBuffer.identifier + 'has been printed');
//         jobFromBuffer.removeAllListeners();
//     });
// });
var outfile = path.join(__dirname, 'imgs', 'mycode.png')
code39.saveImage(outfile, function (err) {
    if (err) throw err;

    console.log('File has been written!');
});

// code39.getStream(function (err, readStream) {
//     // console.log('err: ' + err);
//     if (err) {
//         throw err;
//     }
//     //console.log('readStream: ' + readStream);
//     //console.log('toArray: ' + toArray);
//     // var s = new stream.Readable();
//     // // s._read = function noop() {}; // redundant? see update below
//     // s.push('your text here');
//     // s.push(null);
//     // console.log('-------------');
//     // toArray(s, function (err2, arr) {
//     //     console.log('err: ' + err2);
//     //     if (err2) {
//     //         throw err2;
//     //     }
//     //     console.log('arr is Array: ' + Array.isArray(arr));
//     //
//     // });
//
//
//     // // 'readStream' is an instance of ReadableStream
//     // readStream.pipe(CdnWriteStream);
// });

// var outfile = path.join(__dirname, 'imgs', 'mycode.png');
// console.log('outfile: '+ outfile);
// code39.saveImage(outfile, function (err) {
//     if (err) throw err;
//
//     console.log('File has been written!');
// });


// var jobFromText = nodeprinter.printText(text);
// // Listen events from job
// jobFromText.once('sent', function() {
//
//     jobFromText.on('completed', function() {
//         console.log('Job ' + jobFromText.identifier + ' has been printed');
//         jobFromText.removeAllListeners();
//     });
// });


// var fs = require('fs');
// var Printer = require('ipp-printer');
//
// var printer = new Printer('socket://172.26.205.4:9100');
//
// printer.on('job', function (job) {
//     console.log('[job %d] Printing document: %s', job.id, job.name);
//
//     var filename = 'job-' + job.id + '.ps'; // .ps = PostScript
//     var file = fs.createWriteStream(filename);
//
//     job.on('end', function () {
//         console.log('[job %d] Document saved as %s', job.id, filename)
//     });
//
//     job.pipe(file);
// });


// var ipp = require('ipp');
//
//
// // //make a PDF document
// // var doc = new PDFDocument({margin:0});
// // doc.text(".", 0, 780);
//
// // var PDFDocument, blobStream, doc, stream;
// //
// // PDFDocument = require('pdfkit');
// //
// // blobStream = require('blob-stream');
// //
// // doc = new PDFDocument;
// //
// // stream = doc.pipe(blobStream());
// //
// // doc.end();
// //
// // stream.on('finish', function() {
// //     var blob, url;
// //     blob = stream.toBlob('application/pdf');
// //     url = stream.toBlobURL('application/pdf');
// //     return iframe.src = url;
// // });
// //
//
// var buf = new Buffer([65, 66, 67, 68, 69]);
//
// var printer = ipp.Printer("http://172.26.205.4:9100");
// var msg = {
//     "operation-attributes-tag": {
//         "requesting-user-name": "Allen Li",
//         "job-name": "My Test Job",
//         "document-format": "application/text"
//     },
//     data: buf
// };
// printer.execute("Print-Job", msg, function(err, res){
//     console.log(res);
// });
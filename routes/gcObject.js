/**
 * Created by pi on 7/21/16.
 */
//var Job = require('../../Models/pr/Job');
var Line = require('../models/eq/Line');
var GcsState = require('../lib/stateAndCategory/gcsState');
var GcObject = require('../models/eq/GcObject');
var util = require('util');

module.exports = function (app, i18n) {
    app.get('/gcobject/:ident', function (req, res) {
        var ident = req.params.ident.substring(1);
        //for mode,0:manual,1;automatic
        //for status,0: close, 1: open
        GcObject.findOne({
            where: {ident:ident}
        }).then(function (theGcObject) {
            console.log('theGcObject');
            console.dir(theGcObject);
            if(theGcObject){
                res.json(theGcObject.getClientEndObject());

            }

        });




    });

    app.post('/gcobject', function (req, res) {
        var gcObjectStr = req.body.gcObjectStr;
        console.log('gcObjectStr:  ' + gcObjectStr);
        var gcObject = JSON.parse(gcObjectStr);
        //TODO: GCObject controller
        res.json(gcObject);
    });


};
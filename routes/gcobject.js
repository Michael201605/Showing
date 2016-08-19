/**
 * Created by pi on 7/21/16.
 */
//var Job = require('../../Models/pr/Job');
var Line = require('../models/eq/Line');
var GcsState = require('../lib/stateAndCategory/gcsState');
module.exports = function (app, i18n) {
    app.get('/gcobject/:id', function (req, res) {
        var id = req.params.id.substring(1);
        //for mode,0:manual,1;automatic
        //for status,0: close, 1: open
        var gcObject ={
            id: id,
            mode: 0,
            status: 1
        };
        res.json(gcObject);


    });

    app.post('/gcobject', function (req, res) {
        var gcObjectStr = req.body.gcObjectStr;
        console.log('gcObjectStr:  ' + gcObjectStr);
        var gcObject = JSON.parse(gcObjectStr);
        //TODO: GCObject controller
        res.json(gcObject);
    });


};
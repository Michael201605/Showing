/**
 * Created by pi on 7/21/16.
 */
//var Job = require('../../Models/Pr/Job');
var Line = require('../Models/Eq/Line');
var GcsState = require('../lib/StateAndCategory/GcsState');
module.exports = function (app, i18n) {
    app.get('/line/LineList', function (req, res) {
        Line.findAll({

        }).then(function (lines) {
            console.log('lines: '+ lines);
            res.render('line/LineList',
                {
                    lines: JSON.stringify(lines)
                });
        });

    });
    app.get('/line/LineList/createLine', function (req, res) {
        var lineInfo = {
            Ident: 'newLine',
            State: GcsState.Passive
        };
        Line.create(lineInfo).then(function (newLine) {
            console.log('newLine: ' + JSON.stringify(newLine));
            // console.log('newRecipe.save: ' +newRecipe.save);
            res.json(newLine);
        });
    });
    app.post('/line/LineList/deleteLine', function (req, res) {
        var toDeleteLineIdsStr = req.body.toDeleteLineIdsStr;
        console.log('toDeleteLineIdsStr:  ' + toDeleteLineIdsStr);
        var toDeleteLineIds = JSON.parse(toDeleteLineIdsStr);
        Line.destroy({
            where:{
                id: {
                    $in: toDeleteLineIds
                }
            }
        }).then(function (message) {
            res.json(message);
        });
    });

    app.get('/line/LineDetail/:id', function (req, res) {
        var id = req.params.id.substring(1);
        console.log('Line id: ' + id);
        Line.findOne({
            where: {id: id}
        }).then(function (theLine) {
            var lineStr = JSON.stringify(theLine);
            console.log('line string: ' + lineStr);
            res.render('line/LineDetail',
                {
                    line: lineStr

                });
        });
    });
    app.post('/line/LineDetail', function (req, res) {
        // for(var p in req){
        //     console.log('property of req: '+ p);
        // }
        var lineStr = req.body.lineStr;
        console.log('lineStr: ' + lineStr);
        var lineFromClient = JSON.parse(lineStr);
        console.log('lineFromClient: ' + lineFromClient);
        Line.findOne({
            where: {id: lineFromClient.id}
        }).then(function (theLine) {
            theLine.update(lineFromClient).then(function () {
                console.log("save successfully");
                res.json("save successfully");
            });
        });

    });


    // app.get('/job/JobDetail/Startjob/:Ident', function (req, res) {
    //     var lineIdent = '';
    //     var theLine,
    //         lineController;
    //     var Ident = req.params.Ident.substring(1);
    //     var message = '';
    //     var originMessage = '';
    //     var error = '';
    //     var originError = '';
    //     Job.findOne({
    //         where: {Ident: Ident}
    //     }).then(function (theJob) {
    //         if (theJob) {
    //             lineIdent = theJob.LineIdent;
    //             if (lineIdent) {
    //                 Line.fineone({
    //                     where: {Ident: lineIdent}
    //                 }).then(function (theLine) {
    //                     lineController = ControllerAdapter.getController(theLine.ControllerName);
    //                     lineController.startJob(theJob);
    //                     message = i18n.__('Job {0} is starting', Ident);
    //                     res.send({
    //                         messsage: message,
    //                     });
    //                 });
    //
    //             }
    //             else {
    //                 originError = 'the line: {0} is not found';
    //                 error = i18n.__(originError, lineIdent);
    //                 res.send({
    //                     error: error
    //                 });
    //             }
    //         }
    //         else {
    //             originError = 'the job: {0} is not found';
    //             error = i18n.__(originError, Ident);
    //             res.send({
    //                 error: error
    //             });
    //         }
    //     });
    //
    //
    //
    //
    // });
}
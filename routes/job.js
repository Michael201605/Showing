/**
 * Created by pi on 8/15/16.
 */

var Job = require('../Models/Pr/Job');
var Recipe = require('../Models/Pr/Recipe');
var Line = require('../Models/Eq/Line');
// Job.belongsTo(Line,{as: 'line'});
// var ControllerAdapter = require('../adapters/ControllerAdapter');
var JobState = require('../lib/StateAndCategory/JobState');
// var Recipe = require('../../Models/Pr/Recipe');
module.exports = function (app, i18n) {
    app.get('/job/JobList/:lineIdent', function (req, res) {
        var lineIdent = req.params.lineIdent.substring(1);
        console.log('lineIdent: ' + lineIdent);

        console.log('isAuthenticated: ' + req.isAuthenticated());
        // var jobs =[];
        Job.findAll({
            where: {
                LineIdent: lineIdent,
            }
        }).then(function (jobs) {

            console.log('jobs: ' + jobs);
            res.render('job/JobList',
                {
                    jobs: JSON.stringify(Job.getTranslatedJobs(jobs, i18n)),
                    LineIdent: lineIdent
                });
        });

    });
    app.get('/job/JobList/createJob/:lineIdent', function (req, res) {
        var lineIdent = req.params.lineIdent.substring(1);
        console.log(lineIdent);
        Line.findOne({
            where: {Ident: lineIdent}
        }).then(function (theLine) {
            if(!theLine) {
                var error = i18n.__('the line is not defined');
                res.json({error:error});
                return;
            }
            var jobInfo = {
                Ident: Job.getNewJobIdent(lineIdent),
                Name: lineIdent,
                LineIdent: lineIdent,
                IsTemplate: false,
                State: JobState.Created,
                lineId: theLine.id
            };
            Job.create(jobInfo).then(function (newJob) {
                // for(var p in newJob){
                //     console.log('Job property: ' + p);
                // }
                newJob.setLine(theLine);
                Recipe.create({
                    Ident: newJob.Ident,
                    Name: newJob.Ident,
                    JobIdent: lineIdent,
                    IsTemplate: false,
                    State: JobState.Created,
                    JobId: newJob.id
                })
                //console.log('Job addLine: ' + newJob.addLine);
                console.log('Job setLine: ' + newJob.setLine);
                console.log('Job getLine: ' + newJob.getLine);
                console.log('new Job: ' + JSON.stringify(newJob));
                var newJobStr = newJob.getTranslatedJobStr(i18n);
                console.log('converted new Job: ' + newJobStr);
                res.json(newJobStr);
            });
        });

    });
    app.post('/job/JobList/deleteJob', function (req, res) {
        var toDeleteJobIdsStr = req.body.toDeleteJobIdsStr;
        console.log('toDeleteJobIdsStr:  ' + toDeleteJobIdsStr);
        var toDeleteJobIds = JSON.parse(toDeleteJobIdsStr);
        Job.destroy({
            where:{
                id: {
                    $in: toDeleteJobIds
                }
            }
        }).then(function (message) {
            res.json(message);
        });
    });
    app.get('/job/JobList/:lineIdent', function (req, res) {
        var lineIdent = req.params.lineIdent.substring(1);
        console.log(lineIdent);


        // var jobs =[];
        Job.findAll({
            where: {
                LineIdent: lineIdent,
            }
        }).then(function (jobs) {

            console.log('jobs: ' + jobs);
            res.render('job/JobList',
                {
                    jobs: JSON.stringify(Job.getTranslatedJobs(jobs, i18n)),
                    LineIdent: lineIdent
                });
        });

    });
    app.get('/job/JobDetail/:id', function (req, res) {
        var id = req.params.id.substring(1);
        Job.findOne({
            where: {id: id}
        }).then(function (theJob) {
            res.render('job/JobDetail',
                {
                    job: theJob

                });
        });

    });
    app.get('/job/JobDetail/Startjob/:Ident', function (req, res) {
        var lineIdent = '';
        var theLine,
            lineController;
        var Ident = req.params.Ident.substring(1);
        var message = '';
        var originMessage = '';
        var error = '';
        var originError = '';
        Job.findOne({
            where: {Ident: Ident}
        }).then(function (theJob) {
            if (theJob) {
                lineIdent = theJob.LineIdent;
                if (lineIdent) {
                    Line.fineone({
                        where: {Ident: lineIdent}
                    }).then(function (theLine) {
                        lineController = ControllerAdapter.getController(theLine.ControllerName);
                        lineController.startJob(theJob);
                        message = i18n.__('Job {0} is starting', Ident);
                        res.send({
                            messsage: message,
                        });
                    });

                }
                else {
                    originError = 'the line: {0} is not found';
                    error = i18n.__(originError, lineIdent);
                    res.send({
                        error: error
                    });
                }
            }
            else {
                originError = 'the job: {0} is not found';
                error = i18n.__(originError, Ident);
                res.send({
                    error: error
                });
            }
        });


    });
};
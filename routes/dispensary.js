/**
 * Created by pi on 7/21/16.
 */


var JobState = require('../lib/stateAndCategory/jobState');
var getTranslateOptions = require('../lib/tools/getTranslateOptions');
var Job = require('../models/pr/Job');
var Assembly = require('../models/pr/Assembly');
var LogisticUnit = require('../models/pr/LogisticUnit');
var utils = require('../lib/utils');
var log = require('../lib/log');

module.exports = function (app, i18n) {
    app.get('/station/dispensary/dispensaryJobList/:lineIdent', function (req, res) {
        var lineIdent = req.params.lineIdent.substring(1);
        console.log('lineIdent: ' + lineIdent);
        Job.findAll({
            where: {
                lineIdent: lineIdent
            }
        }).then(function (dispensaryJobs) {
            console.log('dispensary Jobs: ' + dispensaryJobs);
            res.render('station/dispensary/dispensaryJobList', {
                dispensaryJobs: dispensaryJobs
            });
        });

    });
    app.get('/station/dispensary/dispensaryJobDetail/:jobId', function (req, res) {
        var jobId = req.params.jobId.substring(1);
        console.log('jobId: ' + jobId);
        Assembly.findOne({
            where: {
                JobId: jobId
            }
        }).then(function (theAssembly) {
            theAssembly.getAssemblyItems().then(function (assemblyItems) {
                var toAssemblyItems = [];
                var assemblyedItems = [];
                assemblyItems.forEach(function (item) {
                    if (item.isFinished) {
                        assemblyedItems.push(item);
                    }
                    else {
                        toAssemblyItems.push(item);
                    }
                });
                LogisticUnit.findAll({where:{location:theAssembly.location}}).then(function (stocks) {
                    res.render('station/dispensary/dispensaryJobDetail', {
                        assembly: theAssembly,
                        toAssemblyItems: toAssemblyItems,
                        assemblyedItems: assemblyedItems,
                        stocks: stocks
                    });
                })


            });


        });

    });
    app.get('/station/dispensary/scanBarcode/:id/:barcode', function (req, res) {
        var id = req.params.id.substring(1);
        var barcode = req.params.barcode.substring(1);
        var jobJson = {};
        var segments = barcode.split('_');
        var productIdent = '';
        var lotIdent = '';
        if (segments.length && segments.length > 1) {
            productIdent = segments[0];
            lotIdent = segments[1];
            Job.findOne({
                where: {id: id}
            }).then(function (theJob) {
                if (theJob) {
                    if (productIdent === theJob.productIdent) {
                        if (segments.length === 3) {
                            console.log('barcode: ' + barcode);
                            Layer.findOne({where: {sscc: barcode}}).then(function (theLayer) {
                                if (theLayer) {

                                    if (theJob.state === JobState.Created) {
                                        theJob.start(controllerManager, i18n).then(function () {
                                            theJob.registerAssemblyToStorage(theLayer, i18n).then(function (remainWeight) {
                                                theJob.update({actualWeight: remainWeight});
                                                res.json({
                                                    update: {
                                                        displayState: getDisplayState(JobState, JobState.Loading),
                                                        state: JobState.Loading,
                                                        actualWeight: remainWeight
                                                    },
                                                    info: i18n.__('Job is loading, Please scan next barcode.')
                                                });
                                            }, function (pError1) {
                                                res.json(pError1);
                                            });
                                        }, function (pError) {
                                            res.json(pError);
                                        });
                                    } else {
                                        theJob.registerAssemblyToStorage(theLayer).then(function () {
                                            res.json({
                                                info: i18n.__('Please scan next barcode.')
                                            });
                                        }, function (pError1) {
                                            res.json(pError1);
                                        });

                                    }
                                } else {
                                    res.json({error: i18n.__('Layer is not found.')});
                                }
                            });
                        } else {
                            res.json({error: i18n.__('barcode length is invalid')});
                        }

                    } else {
                        res.json({error: i18n.__('take wrong product')});
                    }
                }
                else {
                    res.json({error: i18n.__('Job: %s is empty.', id)});
                }

            });
        } else {
            res.json({error: i18n.__('barcode is invalid')});
        }


    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {

        console.log('is Authenticated!!!');
        return next();
    }


    // if they aren't redirect them to the home page
    res.redirect('/login');
}
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
    app.get('/station/dispensary/dispensaryJobList/:disIdent', function (req, res) {
        var disIdent = req.params.disIdent.substring(1);
        console.log('dispensary ident: ' + disIdent);
        Assembly.findAll({
            where: {
                location: disIdent,
                state: {$in: [1, 2]}
            }
        }).then(function (assemblys) {
            console.log('dispensary Jobs: ' + assemblys);
            res.render('station/dispensary/dispensaryJobList', {
                dispensaryJobs: assemblys
            });
        });

    });
    app.get('/station/dispensary/dispensaryJobDetail/:id', function (req, res) {
        var id = req.params.id.substring(1);
        console.log('assembly id: ' + id);
        Assembly.findOne({
            where: {
                id: id
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
                LogisticUnit.findAll({where: {location: theAssembly.location}}).then(function (stocks) {
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
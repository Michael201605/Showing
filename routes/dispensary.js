/**
 * Created by pi on 7/21/16.
 */


var JobState = require('../lib/stateAndCategory/jobState');
var getTranslateOptions = require('../lib/tools/getTranslateOptions');
var Job = require('../models/pr/Job');
var Assembly = require('../models/pr/Assembly');
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

            res.render('station/dispensary/dispensaryJobDetail', {
                assembly: theAssembly
            });
        });

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
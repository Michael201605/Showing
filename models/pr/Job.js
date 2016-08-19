/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Line = require('../eq/Line');

var JobState = require('../../lib/stateAndCategory/jobState');
var getDisplayState = require('../../lib/tools/getDisplayState');
var properties = {
    ident: {type: modelBase.Sequelize.STRING},
    erpIdent: modelBase.Sequelize.STRING,
    name: modelBase.Sequelize.STRING,
    visible: modelBase.Sequelize.BOOLEAN,
    locked: modelBase.Sequelize.BOOLEAN,
    isTemplate: modelBase.Sequelize.BOOLEAN,
    PlcJobNumber: modelBase.Sequelize.INTEGER,
    state: modelBase.Sequelize.INTEGER,
    recipeIdent: modelBase.Sequelize.STRING,
    lineIdent: modelBase.Sequelize.STRING,
    targetWeight: modelBase.Sequelize.DECIMAL,
    actualWeight: modelBase.Sequelize.DECIMAL
};

var Job = modelBase.define('Job', properties, {
    classMethods: {
        getNewJobIdent: function (lineIdent) {
            Job.findOne({
                attributes: [[modelBase.fn('MAX', modelBase.col('id'))]]
            }).then(function (data) {
                console.log('get max id: ' + data);
                return lineIdent + ':' + data;
            });
        },
        getTranslatedJobs: function (jobs,i18n) {
            var translatedJobs =[];
            //var translatedJobsStr ='';
            jobs.forEach(function (theJob) {
                translatedJobs.push(theJob.getTranslatedJob(i18n));
            });
            return translatedJobs;
        }
    }
});

// Job.Instance.prototype.DisplayState = getDisplayState(JobState, this.State);
Job.Instance.prototype.setDisplayState = function () {

    Job.Instance.prototype.displayState = getDisplayState(JobState, this.state);
};
Job.Instance.prototype.getTranslatedJobStr = function (i18n) {

    // var jobStr = JSON.stringify(this);
    // var JSONJob = JSON.parse(jobStr);
    // JSONJob.DisplayState = i18n.__(getDisplayState(JobState, this.State));
    // return JSON.stringify(JSONJob);
    return JSON.stringify(this.getTranslatedJob(i18n));
};
Job.Instance.prototype.getTranslatedJob = function (i18n) {

    var jobStr = JSON.stringify(this);
    var JSONJob = JSON.parse(jobStr);
    JSONJob.displayState = i18n.__(getDisplayState(JobState, this.state));
    return JSONJob;
};
Job.belongsTo(Line,{as: 'line'});



console.log('Job executed');
module.exports = Job;
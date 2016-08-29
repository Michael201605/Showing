/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Line = require('../eq/Line');
var utils = require('../../lib/utils');
var BusinessBase = require('../BusinessBase');
var JobState = require('../../lib/stateAndCategory/jobState');
var getDisplayState = require('../../lib/tools/getDisplayState');
var Promise = require('promise');
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
            return new Promise(function (resolve, reject) {
                modelBase.query('select max(id) from Jobs',{type: modelBase.QueryTypes.SELECT}).then(function (data) {
                    console.log('max ' + data);
                    console.dir( data);
                    var max = data[0]['max(id)'];
                    resolve(pad(max,6));
                });
                // Job.max('id').then(function (max) {
                //     console.log('max ' + max);
                //     resolve(max);
                // });
            });

        },
        getTranslatedJobs: function (jobs,i18n) {
            var translatedJobs =[];
            //var translatedJobsStr ='';
            jobs.forEach(function (theJob) {
                translatedJobs.push(theJob.getTranslatedJob(i18n));
            });
            return translatedJobs;
        },
        createJob: function () {
            
        }
    }
});
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
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


    var JSONJob = this.getJsonObject();
    JSONJob.displayState = i18n.__(getDisplayState(JobState, this.state));
    return JSONJob;
};
Job.belongsTo(Line,{as: 'Line'});


utils.inherits(Job.Instance.prototype, BusinessBase.prototype);
console.log('Job executed');
module.exports = Job;
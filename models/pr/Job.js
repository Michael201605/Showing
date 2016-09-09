/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Line = require('../eq/Line');
var LayerLog = require('./LayerLog');
var TraceLog = require('./TraceLog');
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
    productIdent: modelBase.Sequelize.STRING,
    productName: modelBase.Sequelize.STRING,
    lineIdent: modelBase.Sequelize.STRING,
    targetWeight: modelBase.Sequelize.DECIMAL,
    actualWeight: modelBase.Sequelize.DECIMAL
};

var Job = modelBase.define('Job', properties, {
    classMethods: {
        getNewJobIdent: function (lineIdent) {
            return new Promise(function (resolve, reject) {
                modelBase.query('select max(id) from Jobs', {type: modelBase.QueryTypes.SELECT}).then(function (data) {
                    console.log('max ' + data);
                    console.dir(data);
                    var max = data[0]['max(id)'];
                    if (!max) {
                        max = 0;
                    }
                    max++;
                    resolve(pad(max, 6));
                });
                // Job.max('id').then(function (max) {
                //     console.log('max ' + max);
                //     resolve(max);
                // });
            });

        },
        getTranslatedJobs: function (jobs, i18n) {
            var translatedJobs = [];
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
    return s.substr(s.length - size);
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
Job.Instance.prototype.getRecipe = function () {
    var Recipe = require('./Recipe');
    var me = this;
    return new Promise(function (resolve, reject) {
        Recipe.findOne({where: {JobId: me.id}}).then(function (theRecipe) {
            if (theRecipe) {
                resolve(theRecipe);
            } else {
                reject('Recipe not found');
            }
        });
    });
};
Job.Instance.prototype.isStarted = function () {

};
Job.Instance.prototype.registerAssemblyToStorage = function (theLayer, i18n) {
    var me = this;
    return new Promise(function (resolve, reject) {
        me.getRecipe().then(function (theRecipe) {
            if (theRecipe) {
                theRecipe.getReceivers({where: {category: 1, isActive: true}}).then(function (receviers) {
                    if (receviers.length > 0) {
                        var storageIdent = receviers[0].storageIdent;
                        LayerLog.findOrCreate({
                            where: {
                                jobIdent: me.ident
                            }, defaults: {
                                lot: theLayer.lot,
                                productIdent: me.productIdent,
                                productName: me.productName,
                                jobLogIdent: me.ident,
                                storageIdent: storageIdent,
                                remainWeight: 0
                            }
                        }).spread(function (theLayerLog, created) {
                            if (theLayerLog) {
                                theLayerLog.remainWeight += theLayer.actualWeight;
                                theLayerLog.save().then(function () {
                                    theLayer.destroy();
                                    resolve(theLayerLog.remainWeight);
                                }).catch(function (error) {
                                    reject({error: error});
                                });
                            } else {
                                reject({error: i18n.__('theLayerLog not found')});
                            }
                        })
                    } else {
                        reject({error: i18n.__('receiver not found')});
                    }

                })
            } else {
                reject({error: i18n.__('recipe not found')});
            }
        });
    });


};
Job.Instance.prototype.finishRegisterAssembly = function (source) {
    var me = this;
    LayerLog.findOne({
        where: {
            jobIdent: me.ident
        }
    }).then(function (theLayerLog) {
        TraceLog.create({
            source: source,
            destination: theLayerLog.storageIdent,
            jobLogIdent: me.ident,
            lot: theLayerLog.lot,
            productIdent: theLayerLog.productIdent,
            productName: theLayerLog.productName,
            transferWeight: theLayerLog.remainWeight
        }).then(function (newTraceLog) {

        });
    })
};
Job.Instance.prototype.start = function (controllerManager, i18n) {
    var me = this;
    var error = '';
    var controller;
    return new Promise(function (resolve, reject) {
        me.getLine().then(function (theLine) {
            console.log('TheLine:');
            console.dir(theLine);
            if (theLine) {
                controller = controllerManager.getController(theLine.controllerName);
                controller.startJob(me).then(function (Pres) {
                    me.update({
                        state: JobState.Loading
                    }).then(function (theJob) {
                        console.log("save successfully");
                        resolve();
                    });


                }, function (pErr) {
                    console.dir(pErr);
                    reject(pErr);

                });
            } else {
                error = i18n.__('the line: %s is not found', me.LineId);
                console.log(error);
                reject(error);
            }
        });
    });


};

Job.belongsTo(Line, {as: 'Line'});


utils.inherits(Job.Instance.prototype, BusinessBase.prototype);
console.log('Job executed');
module.exports = Job;
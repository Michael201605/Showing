/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Line = require('../eq/Line');
var Storage = require('../eq/Storage');
var LayerLog = require('./LayerLog');
var TraceLog = require('./TraceLog');
var utils = require('../../lib/utils');
var log = require('../../lib/log');
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
        getMaxId: function () {
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
        createJob: function (jobInfo, options) {
            var Recipe = require('./Recipe');
            var IngredientComponent = require('./IngredientComponent');
            return modelBase.transaction(function (t1) {
                return Job.create(jobInfo).then(function (newJob) {
                    // for(var p in newJob){
                    //     console.log('Job property: ' + p);
                    // }
                    log.debug('newJob');
                    log.debug(newJob);

                    Recipe.findOne({
                        where: {
                            LineId: newJob.LineId,
                            isTemplate: true
                        }
                    }).then(function (RecipeTemplate) {
                        log.debug('RecipeTemplate: ');
                        log.debug(RecipeTemplate);
                        if (RecipeTemplate) {
                            return Recipe.create({
                                Ident: newJob.Ident,
                                Name: newJob.Ident,
                                isTemplate: false,
                                State: JobState.Created,
                                JobId: newJob.id
                            }).then(function (newRecipe) {
                                log.debug('newRecipe');
                                log.debug(newRecipe);
                                RecipeTemplate.getSenders().then(function (ingredients) {
                                    var promises = [];
                                    ingredients.forEach(function (ingredient) {
                                        promises.push(IngredientComponent.create({
                                            category: ingredient.category,
                                            targetPercentage: ingredient.targetPercentage,
                                            targetWeight: ingredient.targetWeight,
                                            storageIdent: ingredient.storageIdent,
                                            ProductId: ingredient.ProductId,
                                            RecipeId: newRecipe.id,
                                            productIdent: ingredient.productIdent,
                                            isActive: ingredient.isActive
                                        }).then(function (newIngredient) {
                                            log.debug('newIngredient');
                                            log.debug(newIngredient);
                                            if (newIngredient) {
                                                log.debug('created new ingredient');

                                            }
                                            else {
                                                log.debug('ingredient is empty');
                                            }
                                        }));
                                    });
                                    return Promise.all(promises);

                                });
                            });
                        } else {
                            error = global.i18n.__('the recipe template is not defined');
                            log.error(error);
                            throw new Error(error);
                        }

                        // //console.log('Job addLine: ' + newJob.addLine);
                        // console.log('Job setLine: ' + newJob.setLine);
                        // console.log('Job getLine: ' + newJob.getLine);
                        // console.log('new Job: ' + JSON.stringify(newJob));
                        // var newJobStr = newJob.getTranslatedJobStr(i18n);
                        // console.log('converted new Job: ' + newJobStr);
                        // res.json({newJobStr: newJobStr});
                    });
                });

            }).then(function (result) {
                // Transaction has been committed
                // result is whatever the result of the promise chain returned to the transaction callback
            }).catch(function (err) {
                // Transaction has been rolled back
                // err is whatever rejected the promise chain returned to the transaction callback

            });


        }
    }
});
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
utils.inherits(Job.Instance.prototype, BusinessBase.prototype);
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

                                    Storage.findOne({where:{ident: storageIdent}}).then(function (theStorage) {
                                        if(theStorage){
                                            theStorage.currentWeight +=theLayer.actualWeight;
                                            theStorage.save();
                                            resolve(theLayerLog.remainWeight);
                                        }
                                        else {
                                            reject({error: i18n.__('theStorage not found')});
                                        }
                                    });

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



console.log('Job executed');
module.exports = Job;
/**
 * Created by pi on 8/2/16.
 */
var util = require('util');
var ControllerBase = require('./controllerBase');
var Recipe = require('../../models/pr/Recipe');
var Product = require('../../models/pr/Product');
var Line = require('../../models/eq/Line');
var DataType = require('node-opcua').DataType;
var GcsState = require('../stateAndCategory/gcsState');
var Storage = require('../../models/eq/Storage');
var Promise = require('promise');
var GcsStateEnum = new Enum(GcsState);
var TransportController = function (gcObjectAdapter, i18n) {
    this.i18n = i18n;
    this.gcObjectAdapter = gcObjectAdapter;
    this.category = 1;

};
util.inherits(TransportController, ControllerBase);
TransportController.prototype._startJob = function (job) {
    var rcvBinNo = -1;
    var sndBinNo = -1;
    var weightTotal = job.targetWeight;
    var me = this;
    job.getLine().then(function (theLine) {
        theLine.getSections().then(function (sections) {
            var firstSection = sections[0];
            if(firstSection.state == GcsState.Passive){
                var jobIdNodeId = firstSection.nodeId + '.Parameter.JobId';
                var rcvBinNoNodeId = firstSection.nodeId + '.Parameter.RcvBinNo';
                var sndBinNoNodeId = firstSection.nodeId + '.Parameter.SndBinNo';
                var weightTotalNodeId = firstSection.nodeId + '.Parameter.WeightTotal';
                var data = {
                    type: DataType.Int16,
                    value: null
                };
                data.value = job.id;
                me.gcObjectAdapter.setItemValue(jobIdNodeId, data, function (error) {
                    if (!error) {
                        console.log('write successfully: ' + rcvBinNoNodeId);

                        res.json(null);
                    } else {
                        console.log('error: ' + error);
                        res.json(error);
                    }
                });
                Recipe.findOne({
                    where: {JobId: job.id}
                }).then(function (recipe) {
                    if(recipe){
                        recipe.getSenders().then(function (ingredients) {
                            var sender = null;
                            var receiver =null;
                            ingredients.forEach(function (ingredient) {
                                if(ingredient){
                                    if(ingredient.category ===0){
                                        sender = ingredient;
                                    }else {
                                        receiver = ingredient;
                                    }
                                    if(sender && receiver){
                                        sender.getStorage().then(function (theStorage) {
                                            sndBinNo = parseInt(theStorage.ident);
                                            data.value = sndBinNo;
                                            me.gcObjectAdapter.setItemValue(sndBinNoNodeId, data, function (error) {
                                                if (!error) {
                                                    console.log('write successfully: ' + rcvBinNoNodeId);

                                                    res.json(null);
                                                } else {
                                                    console.log('error: ' + error);
                                                    res.json(error);
                                                }
                                            });
                                            receiver.getStorage().then(function (theStorage) {
                                                rcvBinNo = parseInt(theStorage.ident);
                                                data.value = rcvBinNo;
                                                me.gcObjectAdapter.setItemValue(rcvBinNoNodeId, data, function (error) {
                                                    if (!error) {
                                                        console.log('write successfully: ' + sndBinNoNodeId);

                                                        res.json(null);
                                                    } else {
                                                        console.log('error: ' + error);
                                                        res.json(error);
                                                    }
                                                });
                                            });
                                            data = {
                                                type: DataType.Double,
                                                value: weightTotal
                                            };
                                            me.gcObjectAdapter.setItemValue(weightTotalNodeId, data, function (error) {
                                                if (!error) {
                                                    console.log('write successfully: ' + weightTotalNodeId);

                                                    res.json(null);
                                                } else {
                                                    console.log('error: ' + error);
                                                    res.json(error);
                                                }
                                            });
                                        });
                                    }




                                    data.value = sndBinNo;


                                }
                            })
                        });

                    }

                });
            }

        });

    });


};
TransportController.prototype._checkJob = function (job) {
    var errors = [];
    var error = '';
    var me = this;
    return new Promise(function (resolve, reject) {
        if (job) {
            if (job.targetWeight <= 0) {
                error = me.i18n.__('target weight should be positive.');
                errors.push(error);
                reject(errors);
            }
            if (job.LineId) {
                Line.findOne({
                    where: {id: job.LineId}
                }).then(function (theLine) {
                    if (theLine) {
                        if (theLine.state === GcsState.Passive) {
                            Recipe.findOne({
                                where: {
                                    JobId: job.id
                                }
                            }).then(function (theRecipe) {
                                if (theRecipe) {
                                    if (theRecipe.isTemplate) {
                                        error = me.i18n.__('Recipe of job should not be template.');
                                        errors.push(error);
                                        reject(errors);
                                    }
                                    else{
                                        theRecipe.getSenders().then(function (ingredients) {
                                            var sender = null;
                                            var receiver = null;
                                            ingredients.forEach(function (ingredient) {
                                                if (ingredient.category === 0) {
                                                    sender = ingredient;
                                                } else if (ingredient.category === 1) {
                                                    receiver = ingredient;
                                                }
                                            });

                                            me.checkSenderAndReceiver(sender,receiver,theLine.ident,errors).then(function () {
                                                console.log('check job is successful');
                                                resolve();
                                            },function (errorsOfCheck) {
                                                console.log('check job is failed');
                                                console.log(errorsOfCheck);
                                                reject(errorsOfCheck);
                                            });

                                        });
                                    }

                                } else {
                                    error = me.i18n.__('recipe is not defined.');
                                    errors.push(error);
                                    reject(errors);
                                }
                            });
                        } else {
                            error = me.i18n.__('The line %s has job.', theLine.ident);
                            errors.push(error);
                            reject(errors);
                        }
                    } else {
                        error = me.i18n.__('The line is empty.');
                        errors.push(error);
                        reject(errors);
                    }


                });
            }
            else {
                error = me.i18n.__('target weight should be positive.');
                errors.push(error);
                reject(errors);
            }
        }
    });

};
TransportController.prototype.checkSenderAndReceiver = function (sender, receiver, lineIdent, errors) {
    var me = this;
    var error = '';
    return new Promise(function (resolve, reject) {
        if (sender) {
            Storage.findOne({
                where: {
                    id: sender.StorageId
                }
            }).then(function (theStorage) {
                if (theStorage) {

                    if (theStorage.category === 1) {
                        if (theStorage.lineIdent === lineIdent) {
                            me.checkReceiver(receiver, lineIdent, errors).then(function (data) {
                                console.log('receiver check is OK');
                                console.log(data);
                                resolve();
                            },function (errorsOfRec) {
                                console.log('receiver check is failed');
                                console.log(errorsOfRec);
                                reject(errorsOfRec);
                            });
                        } else {
                            error = me.i18n.__('The gate storage is not correct of line, it should be %s', theLine.ident);
                            errors.push(error);
                            reject(errors);
                        }

                    } else {
                        error = me.i18n.__('Storage category is not correct. it should be %d', 1);
                        errors.push(error);
                        reject(errors);
                    }

                } else {
                    error = me.i18n.__('Storage of sender is not defined');
                    errors.push(error);
                    reject(errors);
                }
            })
        } else {
            error = me.i18n.__('Sender is not defined');
            errors.push(error);
            reject(errors);
        }
    });

};
TransportController.prototype.checkReceiver = function (receiver, lineIdent, errors) {
    var me = this;
    var error = '';

    return new Promise(function (resolve, reject) {
        if (receiver) {
            Storage.findOne({
                where: {
                    id: receiver.StorageId
                }
            }).then(function (theStorage) {
                if (theStorage) {
                    if (theStorage.category === 10) {
                        if(theStorage.ProductId === receiver.ProductId){
                            theStorage.getProduct().then(function (theProduct) {
                                if(theProduct){
                                    resolve();
                                }else {
                                    error = me.i18n.__('Product is not defined');
                                    errors.push(error);
                                    reject(errors);
                                }
                            });
                        }else{
                            error = me.i18n.__('Product is not matched between storage and ingredient');
                            errors.push(error);
                            reject(errors);
                        }
                    } else {
                        error = me.i18n.__('Storage category is not correct. it should be %d', 10);
                        errors.push(error);
                        reject(errors);
                    }
                } else {
                    error = me.i18n.__('Storage of receiver is not defined');
                    errors.push(error);
                    reject(errors);
                }
            });
        }
        else {
            error = me.i18n.__('receiver is not defined');
            errors.push(error);
            reject(errors);
        }
    });


};

module.exports = TransportController;
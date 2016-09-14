/**
 * Created by pi on 8/2/16.
 */
var util = require('util');
var myUtils = require('../utils');
var ControllerBase = require('./controllerBase');
var GcsState = require('../stateAndCategory/gcsState');
var SectionCategory = require('../stateAndCategory/sectionCategory');
var JobState = require('../stateAndCategory/jobState');
var DataType = require('node-opcua').DataType;
var Job = require('../../models/pr/Job');
var Promise = require('promise');
// var EventEmitter = require("events").EventEmitter;
var ProduceController = function (gcObjectAdapter, i18n, io) {
    this.i18n = i18n;
    this.gcObjectAdapter = gcObjectAdapter;
    this.io = io;
    var me = this;
    this.category = 0;
    // io.on('connection', function (socket) {
    //     me.on('lineStateChanged', function (options) {
    //
    //         socket.emit('lineStateChanged', options);
    //
    //     });
    //     me.on('lineStateChanged', function (options) {
    //
    //         socket.emit('lineStateChanged', options);
    //
    //     });
    //     me.on('jobStateChanged', function (options) {
    //
    //         socket.emit('jobStateChanged', options);
    //
    //     });
    // });
};

// util.inherits(ProduceController, EventEmitter);
util.inherits(ProduceController, ControllerBase);

ProduceController.prototype._startJob = function (job) {
    var rcvBinNo = -1;
    var sndBinNo = -1;
    var weightTotal = job.targetWeight;
    var me = this;

    return new Promise(function (resolve, reject) {
        job.getLine().then(function (theLine) {
            theLine.getSections({where: {category: SectionCategory.DataHolding}}).then(function (sections) {
                if (!sections) {
                    reject({error: me.i18n.__('section is not found. or has active job')});
                } else {
                    var promises = [];
                    var firstSection = sections[0];
                    if (firstSection && firstSection.state == GcsState.Passive) {
                        var jobIdNodeId = firstSection.nodeId + '.Parameter.JobId';
                        var rcvBinNoNodeId = firstSection.nodeId + '.Parameter.RcvBinNo';
                        var sndBinNoNodeId = firstSection.nodeId + '.Parameter.SndBinNo';
                        var weightTotalNodeId = firstSection.nodeId + '.Parameter.WeightTotal';
                        var data = {
                            type: DataType.Int16,
                            value: null
                        };
                        data.value = job.id;
                        var promise1_1 = new Promise(function (resolve1, reject1) {
                            me.gcObjectAdapter.setItemValue(jobIdNodeId, data, function (error) {
                                if (!error) {
                                    var info = me.i18n.__('write successfully: ' + jobIdNodeId);
                                    firstSection.update({
                                        state: GcsState.Active,
                                        jobIdent: job.ident
                                    }).then(function (theSection) {
                                        if (theSection) {
                                            me.emit('sectionStateChanged', {
                                                lineId: theSection.id,
                                                newState: theSection.state,
                                                displayState: me.i18n.__(myUtils.getDisplayState(GcsState, theSection.state))
                                            });
                                        }
                                        else {
                                            console.log('updated section ')
                                        }

                                    });
                                    resolve1({info: info});
                                } else {
                                    var errorTran = me.i18n.__(error);
                                    reject1({error: errorTran});

                                }
                            });
                        });
                        promises.push(promise1_1);
                        data = {
                            type: DataType.Double,
                            value: weightTotal
                        };
                        var promise1_2 = new Promise(function (resolve1, reject1) {
                            me.gcObjectAdapter.setItemValue(weightTotalNodeId, data, function (error) {
                                if (!error) {
                                    var info = me.i18n.__('write successfully: ' + weightTotalNodeId);
                                    resolve1({info: info});
                                } else {
                                    var errorTran = me.i18n.__(error);
                                    reject1({error: errorTran});
                                }
                            });
                        });
                        promises.push(promise1_2);
                        var promise1_3 = new Promise(function (resolve1, reject1) {
                            Recipe.findOne({
                                where: {JobId: job.id}
                            }).then(function (recipe) {
                                if (recipe) {
                                    data = {
                                        type: DataType.Int16,
                                        value: false
                                    };
                                    recipe.getSenders().then(function (ingredients) {
                                        var sender = null;
                                        var receiver = null;
                                        if (!ingredients) {
                                            reject1({error: i18n.__('ingredients are not found.')})
                                        }
                                        ingredients.forEach(function (ingredient) {
                                            if (ingredient) {
                                                if (ingredient.category === 0) {
                                                    sender = ingredient;
                                                } else {
                                                    receiver = ingredient;
                                                }
                                            }

                                        });
                                        if (sender && receiver) {
                                            var promises2 = [];
                                            var promise2_1 = new Promise(function (resolve2, reject2) {
                                                sender.getStorage().then(function (theStorage) {
                                                    sndBinNo = parseInt(theStorage.ident);
                                                    data.value = sndBinNo;
                                                    me.gcObjectAdapter.setItemValue(sndBinNoNodeId, data, function (error) {
                                                        if (!error) {
                                                            var info = me.i18n.__('write successfully: ' + sndBinNoNodeId);
                                                            resolve2({info: info});
                                                        } else {
                                                            var errorTran = me.i18n.__(error);
                                                            reject2({error: errorTran});
                                                        }
                                                    });

                                                });
                                            });
                                            promises2.push(promise2_1);
                                            var promise2_2 = new Promise(function (resolve2, reject2) {
                                                receiver.getStorage().then(function (theStorage) {
                                                    rcvBinNo = parseInt(theStorage.ident);
                                                    data.value = rcvBinNo;
                                                    me.gcObjectAdapter.setItemValue(rcvBinNoNodeId, data, function (error) {
                                                        if (!error) {
                                                            var info = me.i18n.__('write successfully: ' + rcvBinNoNodeId);
                                                            resolve2({info: info});
                                                        } else {
                                                            var errorTran = me.i18n.__(error);
                                                            reject2({error: errorTran});
                                                        }
                                                    });

                                                });
                                            });
                                            promises2.push(promise2_2);
                                            Promise.all(promises2).then(function (res) {
                                                resolve1(res);

                                            }, function (err) {
                                                reject1(err);
                                            });
                                        }
                                        else {
                                            reject1({error: me.i18n.__('sender or receiver is not found.')});
                                        }
                                    });

                                }
                                else {
                                    reject1({error: me.i18n.__('recipe is not found.')});
                                }

                            });
                        });
                        promises.push(promise1_3);
                        Promise.all(promises).then(function (res) {
                            JobLog.findOne({
                                where: {
                                    jobIdent: job.ident
                                }
                            }).then(function (theJobLog) {
                                if (!theJobLog) {
                                    JobLog.create({
                                        ident: job.ident,
                                        jobIdent: job.ident,
                                        lineIdent: job.lineIdent
                                    }).then(function (newJobLog) {

                                    });
                                }
                            });
                            resolve(res);

                        }, function (err) {
                            reject(err);
                        });

                    } else {
                        reject({error: me.i18n.__('section is not found. or has active job')})
                    }
                }


            });


        });
    });


};
ProduceController.prototype.lineStateChangeCallback = function (theLine, options) {
    var me = this;
    if (options) {
        if (options.newState === GcsState.Active) {
            if (theLine) {
                if (!theLine.previousState || theLine.previousState === GcsState.Passive) {
                    theLine.previousState = theLine.state;
                    theLine.state = options.newState;
                    theLine.save();
                    me.emit('lineStateChanged', {
                        lineId: theLine.id,
                        newState: theLine.state,
                        displayState: me.i18n.__(myUtils.getDisplayState(GcsState, theLine.state))
                    });
                }
            }
        }
        if (options.newState === GcsState.Emptying) {
            if (theLine) {
                if (theLine.previousState === GcsState.Active) {
                    theLine.previousState = theLine.state;
                    theLine.state = options.newState;
                    theLine.save();
                }
            }
        }
        if (options.newState === GcsState.Passive) {
            if (theLine) {
                if (theLine.previousState === GcsState.Emptying) {
                    theLine.previousState = theLine.state;
                    theLine.state = options.newState;
                    theLine.save();
                }
            }
        }
    }
};
ProduceController.prototype.sectionStateChangeCallback = function (theSection, options) {
    var me = this;
    if (options) {
        if (options.newState === GcsState.Active) {
            if (theSection) {
                if (!theSection.previousState || theSection.previousState === GcsState.Passive) {
                    if (options.jobId) {
                        Job.findOne({where: {id: options.jobId}}).then(function (theJob) {
                            theSection.jobIdent = theJob.ident;
                            theSection.previousState = theSection.state;
                            theSection.state = options.newState;
                            theSection.save();
                            me.emit('sectionStateChanged', {
                                lineId: theSection.id,
                                newState: theSection.state,
                                displayState: me.i18n.__(myUtils.getDisplayState(GcsState, theSection.state))
                            });
                            if (theSection.category === SectionCategory.Dosing) {
                                theJob.state = JobState.HandAdd;
                            }
                            if (theSection.category === SectionCategory.Mixing) {
                                theJob.state = JobState.Mixing;
                            }
                            if (theSection.category === SectionCategory.Packing) {
                                theJob.state = JobState.Packing;
                            }
                            if (theSection.category === SectionCategory.Palleting) {
                                theJob.state = JobState.Palleting;
                            }
                            theJob.save();
                            me.emit('jobStateChanged', {
                                lineId: theJob.id,
                                newState: theJob.state,
                                displayState: me.i18n.__(myUtils.getDisplayState(JobState, theJob.state))
                            });
                        })
                    }
                }
            }
        }
        if (options.newState === GcsState.Emptying) {
            if (theSection) {
                if (theSection.previousState === GcsState.Active) {
                    theSection.previousState = theSection.state;
                    theSection.state = options.newState;
                    theSection.save();
                }
            }
        }
        if (options.newState === GcsState.Passive) {
            if (theSection) {
                if (theSection.previousState === GcsState.Emptying) {
                    theSection.previousState = theSection.state;
                    theSection.state = options.newState;
                    theSection.save();
                }
            }
        }
    }

};
module.exports = ProduceController;
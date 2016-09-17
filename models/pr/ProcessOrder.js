/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var Line = require('../eq/Line');
var Mixer = require('../eq/Mixer');
var Job = require('./Job');
var JobState = require('../../lib/stateAndCategory/jobState');
var OrderItem = require('./OrderItem');
var Promise = require('promise');
var utils = require('../../lib/utils');
var BusinessBase = require('../BusinessBase');

var ProcessOrder = modelBase.define('ProcessOrder', {
    ident: modelBase.Sequelize.STRING,
    erpIdent: modelBase.Sequelize.STRING,
    name: modelBase.Sequelize.STRING,
    isTemplate: modelBase.Sequelize.BOOLEAN,
    state: modelBase.Sequelize.INTEGER,
    targetWeight: modelBase.Sequelize.DECIMAL,
    packSize: modelBase.Sequelize.DECIMAL,
    productIdent: modelBase.Sequelize.STRING,
    mixerIdent: modelBase.Sequelize.STRING,
    lineIdent: modelBase.Sequelize.STRING,
    mixingTime: modelBase.Sequelize.INTEGER,
    isMedicatedOrder: modelBase.Sequelize.BOOLEAN
});

utils.inherits(ProcessOrder.Instance.prototype, BusinessBase.prototype);
ProcessOrder.Instance.prototype.checkOrder = function (i18n) {
    var me = this;
    var errors = [];
    var error = '';
    return new Promise(function (resolve, reject) {
        if (!me.ProductId) {
            error = i18n.__('product is not set.');
            errors.push(error);
        }
        if (!me.LineId) {
            error = i18n.__('Line is not set.');
            errors.push(error);
        }
        if (!me.mixerIdent) {
            error = i18n.__('mixerIdent is not set.');
            errors.push(error);
        }
        if (!me.lineIdent) {
            error = i18n.__('lineIdent is not set.');
            errors.push(error);
        }
        if (!me.mixingTime || me.mixingTime <= 0) {
            error = i18n.__('mixingTime is not set.');
            errors.push(error);
        }
        if (!me.isMedicatedOrder) {
            // error = i18n.__('medicated type not set.');
            // errors.push(error);
            //TODO
            //cross function not implemented
        }
        if (!me.targetWeight || me.targetWeight <= 0) {
            error = i18n.__('targetWeight is not set.');
            errors.push(error);
        }
        if (!me.packSize || me.packSize <= 0) {
            error = i18n.__('packSize is not set.');
            errors.push(error);
        }
        me.getOrderItems().then(function (orderItems) {
            if (orderItems.length === 0) {
                error = i18n.__('BOM is not found.');
                errors.push(error);
                reject(errors);
            }
            else {
                orderItems.forEach(function (orderItem) {
                    if (!orderItem.ProductId) {
                        error = i18n.__('product of item is not set.');
                        errors.push(error);
                    }
                });
                if (errors.length > 0) {
                    reject(errors);
                } else {
                    resolve();
                }

            }
        });
    });


};

ProcessOrder.Instance.prototype.releaseOrder = function (i18n) {
    var me = this;
    return new Promise(function (resolve, reject) {
        me.checkOrder(i18n).then(function () {
            Mixer.findOne({where: {ident: me.mixerIdent}}).then(function (theMixer) {
                if (theMixer) {
                    var remainWeight = 0;
                    var theMaxWeight = theMixer.weightMax;
                    if (me.targetWeight > theMaxWeight) {
                        var count = me.targetWeight / theMaxWeight;
                        var i = 0;
                        for (i = 1; i <= count; i++) {
                            Job.createJob({
                                ident: me.ident + ':' + utils.pad(i, 6),
                                name: me.lineIdent,
                                lineIdent: me.lineIdent,
                                visible: true,
                                isTemplate: false,
                                locked: true,
                                targetWeight: theMaxWeight,
                                actualWeight: 0.0,
                                state: JobState.Created,
                                LineId: me.LineId
                            }).then(function (data) {
                                console.log('transaction info: ' + data);
                            })
                        }
                        remainWeight = me.targetWeight - count * theMaxWeight;
                        if (remainWeight > 0) {
                            Job.createJob({
                                ident: me.ident + ':' + utils.pad(i + 1, 6),
                                name: me.lineIdent,
                                lineIdent: me.lineIdent,
                                visible: true,
                                isTemplate: false,
                                locked: true,
                                targetWeight: remainWeight,
                                actualWeight: 0.0,
                                state: JobState.Created,
                                LineId: me.LineId
                            }).then(function (data) {
                                console.log('transaction info: ' + data);
                            });
                        }
                    } else {
                        if (me.targetWeight < theMixer.weightMin) {
                            reject({error: global.i18n.__('target weight is too small.')});
                        } else {
                            Job.createJob({
                                ident: me.ident + ':' + utils.pad(i + 1, 6),
                                name: me.lineIdent,
                                lineIdent: me.lineIdent,
                                visible: true,
                                isTemplate: false,
                                locked: true,
                                targetWeight: me.targetWeight,
                                actualWeight: 0.0,
                                state: JobState.Created,
                                LineId: me.LineId
                            }).then(function (data) {
                                console.log('transaction info: ' + data);
                            });
                        }
                    }
                }
                else {
                    reject({error: global.i18n.__('theMixer is not found.')});
                }
            })
        }, function (errors) {
            reject({errors: errors});
        })
    });

};


ProcessOrder.belongsTo(Product);
ProcessOrder.belongsTo(Job);
ProcessOrder.belongsTo(Line);
ProcessOrder.hasMany(OrderItem);
module.exports = ProcessOrder;
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var Line = require('../eq/Line');
var Job = require('./Job');
var OrderItem = require('./OrderItem');
var Promise = require('promise');

var ProcessOrder = modelBase.define('ProcessOrder',{
    ident : modelBase.Sequelize.STRING,
    erpIdent : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    isTemplate : modelBase.Sequelize.BOOLEAN,
    state :  modelBase.Sequelize.INTEGER,
    targetWeight: modelBase.Sequelize.DECIMAL,
    packSize: modelBase.Sequelize.DECIMAL,
    productIdent: modelBase.Sequelize.STRING,
    mixerIdent: modelBase.Sequelize.STRING,
    mixingTime :  modelBase.Sequelize.INTEGER
});

ProcessOrder.Instance.prototype.checkOrder = function (i18n) {
    var me = this;
    var errors =[];
    var error ='';
    return new Promise(function (resolve, reject) {
        if(!me.ProductId){
            error = i18n.__('product is not set.');
            errors.push(error);
        }
        if(!me.LineId){
            error = i18n.__('Line is not set.');
            errors.push(error);
        }
        if(!me.mixerIdent){
            error = i18n.__('mixerIdent is not set.');
            errors.push(error);
        }
        if(!me.mixingTime||me.mixingTime <=0){
            error = i18n.__('mixingTime is not set.');
            errors.push(error);
        }
        if(!me.targetWeight||me.targetWeight <=0){
            error = i18n.__('targetWeight is not set.');
            errors.push(error);
        }
        if(!me.packSize||me.packSize <=0){
            error = i18n.__('packSize is not set.');
            errors.push(error);
        }
        me.getOrderItems().then(function (orderItems) {
            if(orderItems.length ===0){
                error = i18n.__('BOM is not found.');
                errors.push(error);
                reject(errors);
            }
            else{
                orderItems.forEach(function (orderItem) {
                    if(!orderItem.ProductId){
                        error = i18n.__('product of item is not set.');
                        errors.push(error);
                    }
                });
                if(errors.length>0){
                    reject(errors);
                }else {
                    resolve();
                }

            }
        });
    });


};

ProcessOrder.Instance.prototype.releaseOrder = function (i18n) {

    // var jobStr = JSON.stringify(this);
    // var JSONJob = JSON.parse(jobStr);
    // JSONJob.DisplayState = i18n.__(getDisplayState(JobState, this.State));
    // return JSON.stringify(JSONJob);
    return JSON.stringify(this.getTranslatedJob(i18n));
};


ProcessOrder.belongsTo(Product);
ProcessOrder.belongsTo(Job);
ProcessOrder.belongsTo(Line);
ProcessOrder.hasMany(OrderItem);
module.exports = ProcessOrder;
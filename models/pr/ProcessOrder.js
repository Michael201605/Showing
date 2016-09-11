/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var Job = require('./Job');
var OrderItem = require('./OrderItem');
var ProcessOrder = modelBase.define('ProcessOrder',{
    ident : modelBase.Sequelize.STRING,
    erpIdent : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    isTemplate : modelBase.Sequelize.BOOLEAN,
    state :  modelBase.Sequelize.INTEGER,
    targetWeight: modelBase.Sequelize.DECIMAL,
    productIdent: modelBase.Sequelize.STRING,
    mixerIdent: modelBase.Sequelize.STRING
});

ProcessOrder.Instance.prototype.checkOrder = function (i18n) {
    var me = this;
    var errors =[];
    var error ='';
    if(!me.ProductId){
        error = i18n.__('product is not set.');
    }

    // var jobStr = JSON.stringify(this);
    // var JSONJob = JSON.parse(jobStr);
    // JSONJob.DisplayState = i18n.__(getDisplayState(JobState, this.State));
    // return JSON.stringify(JSONJob);
    return JSON.stringify(this.getTranslatedJob(i18n));
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
ProcessOrder.hasMany(OrderItem);
module.exports = ProcessOrder;
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Job = require('./Job');
var Layer = require('./Layer');

var properties = {
    jobIdent: {type: modelBase.Sequelize.STRING},
    name: modelBase.Sequelize.STRING,
    nbOfUnits: modelBase.Sequelize.DECIMAL,
    packagingType: modelBase.Sequelize.INTEGER,
    isUnitSizeUsed: modelBase.Sequelize.BOOLEAN,
    sscc: modelBase.Sequelize.STRING,
    deliveryDate: modelBase.Sequelize.DATE,
    state: modelBase.Sequelize.INTEGER,
    lot:  modelBase.Sequelize.STRING,
    supplierIdent: modelBase.Sequelize.STRING,
    supplierName: modelBase.Sequelize.STRING,
    location: modelBase.Sequelize.STRING,
    targetWeight: modelBase.Sequelize.DECIMAL
};

var Assembly = modelBase.define('Assembly', properties);
Assembly.hasMany(Layer);

Assembly.belongsTo(Job);

console.log('Assembly executed');
module.exports = Assembly;
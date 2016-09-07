/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var Layer = require('./Layer');

var properties = {
    ident: {type: modelBase.Sequelize.STRING},
    name: modelBase.Sequelize.STRING,
    unitSize: modelBase.Sequelize.DECIMAL,
    nbOfUnits: modelBase.Sequelize.DECIMAL,
    packagingType: modelBase.Sequelize.INTEGER,
    isUnitSizeUsed: modelBase.Sequelize.BOOLEAN,
    sscc: modelBase.Sequelize.STRING,
    deliveryDate: modelBase.Sequelize.DATE,
    state: modelBase.Sequelize.INTEGER,
    lot:  modelBase.Sequelize.STRING,
    supplierIdent: modelBase.Sequelize.STRING,
    supplierName: modelBase.Sequelize.STRING
};

var LogisticUnit = modelBase.define('LogisticUnit', properties);
LogisticUnit.hasMany(Layer);

LogisticUnit.belongsTo(Product);

console.log('LogisticUnit executed');
module.exports = LogisticUnit;
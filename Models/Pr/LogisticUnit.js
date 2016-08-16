/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var Layer = require('./Layer');

var properties = {
    Ident: {type: modelBase.Sequelize.STRING},
    Name: modelBase.Sequelize.STRING,
    UnitSize: modelBase.Sequelize.DECIMAL,
    NbOfUnits: modelBase.Sequelize.DECIMAL,
    PackagingType: modelBase.Sequelize.INTEGER,
    IsUnitSizeUsed: modelBase.Sequelize.BOOLEAN,
    SSCC: modelBase.Sequelize.STRING,
    DeliveryDate: modelBase.Sequelize.DATE,
    State: modelBase.Sequelize.INTEGER,
    LOT:  modelBase.Sequelize.STRING,
    SupplierIdent: modelBase.Sequelize.STRING,
    SupplierName: modelBase.Sequelize.STRING
};

var LogisticUnit = modelBase.define('LogisticUnit', properties);
LogisticUnit.hasMany(Layer);

LogisticUnit.belongsTo(Product,{as: 'Product'});

console.log('LogisticUnit executed');
module.exports = LogisticUnit;
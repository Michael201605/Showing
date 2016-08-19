/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Company = require('../eq/Company');
var Product = require('./Product');
var LogisticUnit = require('./LogisticUnit');
var Layer = require('./Layer');
var WarehousePackingType = require('../../lib/stateAndCategory/warehousePackingType');

var properties = {
    ident: {type: modelBase.Sequelize.STRING},
    name: modelBase.Sequelize.STRING,
    visible: modelBase.Sequelize.BOOLEAN,
    locked: modelBase.Sequelize.BOOLEAN,
    lot: modelBase.Sequelize.STRING,
    packagingType: modelBase.Sequelize.INTEGER,
    state: modelBase.Sequelize.INTEGER,
    targetWeight: modelBase.Sequelize.DECIMAL,
    targetUnitSize: modelBase.Sequelize.DECIMAL,
    actualWeight: modelBase.Sequelize.DECIMAL,
    actualUnitSize: modelBase.Sequelize.DECIMAL,
    actualNbOfUnits: modelBase.Sequelize.DECIMAL,

};

var Receipt = modelBase.define('Receipt', properties);


Receipt.belongsTo(Company, {as: 'supplier'});
Receipt.belongsTo(Product, {as: 'product'});


Receipt.Instance.prototype.checkReceipt = function (i18n) {

    var errors = [];
    for (var pro in this) {
        if (this.hasOwnProperty(pro)) {
            switch (pro) {
                case 'lot':
                case 'packagingType':
                case 'actualUnitSize':
                case 'actualNbOfUnits':
                case 'productId':
                case 'supplierId':
                    if (!this[pro]) {
                        var property = i18n.__(pro);
                        var error = i18n.__('property: {0} is not set.', property);
                        errors.push(error);
                    }
                    break;
            }

        }
    }
    return errors;
};
Receipt.Instance.prototype.confirmReceipt = function (i18n) {
    var errors = this.checkReceipt(i18n);
    if (errors.length == 0) {
        var theProduct = this.getProduct();
        var theSupplier = this.getSupplier();
        var sscc = '';
        var supplierIdent = '';
        var supplierName = '';
        if (theProduct) {
            SSCC = theProduct.ident + '_' + this.lot;
        }
        if (theSupplier) {
            supplierIdent = theSupplier.ident;
            supplierName = theSupplier.name;
        }
        var logisticUnitInfo = {
            ident: 'WH:000',
            name: 'WH',
            unitSize: this.actualUnitSize,
            nbOfUnits: this.actualNbOfUnits,
            packagingType: this.packagingType,
            isUnitSizeUsed: false,
            sscc: sscc,
            lot: this.lot,
            productId: this.productId,
            supplierIdent: supplierIdent,
            supplierName:supplierName
        };
        LogisticUnit.create(logisticUnitInfo).then(function (newLogistic) {
            console.log('newLogistic: ' + JSON.stringify(newLogistic));
            if (newLogistic.packagingType == WarehousePackingType.Bag) {
                for (var i = 0; i < newLogistic.UnitSize; i++) {
                    var layInfo = {
                        sscc: sscc + '_' + i.tostring('0000'),
                        bagNO: i,
                        size: newLogistic.unitSize,
                        actualWeight: newLogistic.unitSize,
                        logisticUnitId: newLogistic.id
                    };
                    Layer.create(layInfo).then(function (newLayer) {
                        console.log('newLayer: ' + JSON.stringify(newLayer));
                    });
                }
            }
        })
    }
    else {
        return errors;
    }
};
console.log('Receipt executed');
module.exports = Receipt;
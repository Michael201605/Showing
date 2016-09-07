/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Company = require('../eq/Company');
var Product = require('./Product');
var LogisticUnit = require('./LogisticUnit');
var Layer = require('./Layer');
var utils = require('../../lib/utils');
var BusinessBase = require('../BusinessBase');
var WarehousePackingType = require('../../lib/stateAndCategory/warehousePackingType');
var Promise = require('promise');
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
    productIdent: modelBase.Sequelize.STRING,
    productName: modelBase.Sequelize.STRING,
    supplierIdent: modelBase.Sequelize.STRING,
    supplierName: modelBase.Sequelize.STRING
};

var Receipt = modelBase.define('Receipt', properties);


Receipt.belongsTo(Company,{as: 'Supplier'});
Receipt.belongsTo(Product);

utils.inherits(Receipt.Instance.prototype, BusinessBase.prototype);

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
    var sscc = '';
    var supplierIdent = '';
    var supplierName = '';
    var me = this;
    return new Promise(function (resolve, reject) {
        if (errors.length == 0) {
            me.getProduct().then(function (theProduct) {
                if(theProduct){
                    sscc = theProduct.ident + '_' + me.lot;
                }
                me.getSupplier().then(function (theSupplier) {
                    if (theSupplier) {
                        supplierIdent = theSupplier.ident;
                        supplierName = theSupplier.name;
                    }
                    me.getMaxId('LogisticUnits').then(function (maxId) {
                        var logisticUnitInfo = {
                            ident: 'WH:'+ maxId,
                            name: 'WH',
                            unitSize: me.actualUnitSize,
                            nbOfUnits: me.actualNbOfUnits,
                            packagingType: me.packagingType,
                            isUnitSizeUsed: false,
                            sscc: sscc,
                            lot: me.lot,
                            ProductId: me.ProductId,
                            supplierIdent: supplierIdent,
                            supplierName:supplierName
                        };
                        LogisticUnit.create(logisticUnitInfo).then(function (newLogistic) {
                            console.log('newLogistic: ' + JSON.stringify(newLogistic));
                            if (newLogistic.packagingType == WarehousePackingType.Bag) {
                                for (var i = 1; i <= newLogistic.nbOfUnits; i++) {
                                    var layInfo = {
                                        sscc: sscc + '_' + utils.pad(i,4),
                                        bagNo: i,
                                        size: newLogistic.unitSize,
                                        actualWeight: newLogistic.unitSize,
                                        LogisticUnitId: newLogistic.id
                                    };
                                    Layer.create(layInfo).then(function (newLayer) {
                                        console.log('newLayer: ' + JSON.stringify(newLayer));
                                    });
                                }

                            }
                            me.update({
                                state: 80
                            }).then(function (theReceipt) {

                            });
                            resolve({info: i18n.__('confirm successfully')});
                        });
                    });

                });
            });
        }
        else {
            reject({errors:errors});
        }
    });

};

console.log('Receipt executed');
module.exports = Receipt;
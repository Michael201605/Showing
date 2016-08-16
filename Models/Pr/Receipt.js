/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Company = require('../Eq/Company');
var Product = require('./Product');
var LogisticUnit = require('./LogisticUnit');
var Layer = require('./Layer');
var WarehousePackingType = require('../../lib/StateAndCategory/WarehousePackingType');

var properties = {
    Ident: {type: modelBase.Sequelize.STRING},
    Name: modelBase.Sequelize.STRING,
    Visible: modelBase.Sequelize.BOOLEAN,
    Locked: modelBase.Sequelize.BOOLEAN,
    LOT: modelBase.Sequelize.STRING,
    PackagingType: modelBase.Sequelize.INTEGER,
    State: modelBase.Sequelize.INTEGER,
    TargetWeight: modelBase.Sequelize.DECIMAL,
    TargetUnitSize: modelBase.Sequelize.DECIMAL,
    ActualWeight: modelBase.Sequelize.DECIMAL,
    ActualUnitSize: modelBase.Sequelize.DECIMAL,
    ActualNbOfUnits: modelBase.Sequelize.DECIMAL,

};

var Receipt = modelBase.define('Receipt', properties);


Receipt.belongsTo(Company, {as: 'Supplier'});
Receipt.belongsTo(Product, {as: 'Product'});


Receipt.Instance.prototype.checkReceipt = function (i18n) {

    var errors = [];
    for (var pro in this) {
        if (this.hasOwnProperty(pro)) {
            switch (pro) {
                case 'LOT':
                case 'PackagingType':
                case 'ActualUnitSize':
                case 'ActualNbOfUnits':
                case 'ProductId':
                case 'SupplierId':
                case 'SupplierName':
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
        var SSCC = '',
            SupplierIdent = '',
            SupplierName = '';
        if (theProduct) {
            SSCC = theProduct.Ident + '_' + this.LOT;

        }
        if (theSupplier) {
            SupplierIdent = theSupplier.Ident;
            SupplierName = theSupplier.Name;
        }
        var logisticUnitInfo = {
            Ident: 'WH:000',
            Name: 'WH',
            UnitSize: this.ActualUnitSize,
            NbOfUnits: this.ActualNbOfUnits,
            PackagingType: this.PackagingType,
            IsUnitSizeUsed: false,
            SSCC: SSCC,
            LOT: this.LOT,
            ProductId: this.ProductId,
            SupplierIdent: SupplierIdent,
            SupplierName:SupplierName
        };
        LogisticUnit.create(logisticUnitInfo).then(function (newLogistic) {
            console.log('newLogistic: ' + JSON.stringify(newLogistic));
            if (newLogistic.PackagingType == WarehousePackingType.Bag) {
                for (var i = 0; i < newLogistic.UnitSize; i++) {
                    var layInfo = {
                        SSCC: SSCC + '_' + i.tostring('0000'),
                        BagNO: i,
                        Size: newLogistic.UnitSize,
                        ActualWeight: newLogistic.UnitSize,
                        LogisticUnitId: newLogistic.id
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
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Company = require('../Eq/Company');
var LogisticUnit = require('./LogisticUnit');

var properties = {
    SSCC: modelBase.Sequelize.STRING,
    BagNO: modelBase.Sequelize.INTEGER,
    State: modelBase.Sequelize.INTEGER,
    Size: modelBase.Sequelize.DECIMAL,
    ActualWeight: modelBase.Sequelize.DECIMAL
};

var Layer = modelBase.define('Layer', properties);



console.log('Layer executed');
module.exports = Layer;
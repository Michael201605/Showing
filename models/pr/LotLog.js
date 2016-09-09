/**
 * Created by pi on 9/8/16.
 */
var modelBase = require('../ModelBase');

var properties = {
    ident: modelBase.Sequelize.STRING,
    productIdent: modelBase.Sequelize.STRING,
    productName: modelBase.Sequelize.STRING,
    state: modelBase.Sequelize.INTEGER,
    expireDate: modelBase.Sequelize.DATE,
    size: modelBase.Sequelize.DECIMAL,
    actualWeight: modelBase.Sequelize.DECIMAL
};

var LotLog = modelBase.define('LotLog', properties);



console.log('LotLog executed');
module.exports = LotLog;
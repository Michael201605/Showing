/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var properties = {
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
};
properties = modelBase.expendGcsProperty(properties);
var Discharger = modelBase.define('Discharger',properties);

module.exports = Discharger;
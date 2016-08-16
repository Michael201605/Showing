/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Filler = require('./Filler');
var Discharger = require('./Discharger');
var Product = require('../Pr/Product');

var Storage = modelBase.define('Storage',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
});

Storage.hasMany(Filler);
Storage.hasMany(Discharger);
Storage.belongsTo(Product);

module.exports = Storage;
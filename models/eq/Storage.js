/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Filler = require('./Filler');
var Discharger = require('./Discharger');
var Product = require('../pr/Product');

var Storage = modelBase.define('Storage',{
    ident : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
});

Storage.hasMany(Filler);
Storage.hasMany(Discharger);
Storage.belongsTo(Product);

module.exports = Storage;
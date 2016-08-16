/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Discharger = require('./Discharger');

var Scale = modelBase.define('Scale',{
    Ident : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    State :  modelBase.Sequelize.INTEGER,
});
Scale.hasMany(Discharger);
module.exports = Scale;
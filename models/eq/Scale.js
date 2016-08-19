/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Discharger = require('./Discharger');

var Scale = modelBase.define('Scale',{
    ident : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    state :  modelBase.Sequelize.INTEGER,
});
Scale.hasMany(Discharger);
module.exports = Scale;
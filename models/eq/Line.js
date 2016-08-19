/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Section = require('./Section');

var Line = modelBase.define('Line',{
    ident : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    state :  modelBase.Sequelize.INTEGER,
    controllerName : modelBase.Sequelize.STRING
});
Line.hasMany(Section);
// Line.sync();
module.exports = Line;
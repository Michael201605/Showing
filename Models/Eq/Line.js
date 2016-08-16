/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Section = require('./Section');

var Line = modelBase.define('Line',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    State :  modelBase.Sequelize.INTEGER,
    ControllerName : modelBase.Sequelize.STRING
});
Line.hasMany(Section);
// Line.sync();
module.exports = Line;
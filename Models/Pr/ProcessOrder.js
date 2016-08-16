/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var Line = modelBase.define('Line',{
    Ident : modelBase.Sequelize.STRING,
    ERPIdent : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    IsTemplate : modelBase.Sequelize.BOOLEAN,
    PlcJobNumber : modelBase.Sequelize.INTEGER,
    State :  modelBase.Sequelize.INTEGER,
    RecipeIdent : modelBase.Sequelize.STRING,
    LineIdent : modelBase.Sequelize.STRING,
    ControllerName : modelBase.Sequelize.STRING,
});

module.exports = Line;
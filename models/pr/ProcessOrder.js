/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var Line = modelBase.define('Line',{
    ident : modelBase.Sequelize.STRING,
    erpIdent : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    isTemplate : modelBase.Sequelize.BOOLEAN,
    state :  modelBase.Sequelize.INTEGER
});

module.exports = Line;
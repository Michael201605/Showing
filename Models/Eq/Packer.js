/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var Packer = modelBase.define('Packer',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    State :  modelBase.Sequelize.INTEGER
});

module.exports = Packer;
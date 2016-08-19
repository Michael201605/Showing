/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var Packer = modelBase.define('Packer',{
    ident : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    state :  modelBase.Sequelize.INTEGER
});

module.exports = Packer;
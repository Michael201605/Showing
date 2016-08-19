/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var Product = modelBase.define('Product',{
    ident : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    state :  modelBase.Sequelize.INTEGER
});

module.exports = Product;
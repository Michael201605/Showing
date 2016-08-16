/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');


var Company = modelBase.define('Company',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    Address :  modelBase.Sequelize.STRING
});

module.exports = Company;
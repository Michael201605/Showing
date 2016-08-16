/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var Filler = modelBase.define('Filler',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
});

module.exports = Filler;
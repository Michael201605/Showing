/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var properties = {
    Ident: modelBase.Sequelize.STRING,
    Name: modelBase.Sequelize.STRING
};

var AccessRight = modelBase.define('AccessRight', properties);



console.log('AccessRight executed');
module.exports = AccessRight;
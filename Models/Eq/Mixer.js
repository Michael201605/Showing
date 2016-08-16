/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Section = require('./Section');

var Mixer = modelBase.define('Mixer',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    State :  modelBase.Sequelize.INTEGER
});
Mixer.belongsTo(Section);
module.exports = Mixer;
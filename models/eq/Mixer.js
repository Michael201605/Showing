/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Section = require('./Section');

var Mixer = modelBase.define('Mixer',{
    ident : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    state :  modelBase.Sequelize.INTEGER,
    weightMax: modelBase.Sequelize.DECIMAL,
    weightMin: modelBase.Sequelize.DECIMAL
});
Mixer.belongsTo(Section);
module.exports = Mixer;
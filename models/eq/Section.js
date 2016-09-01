/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Scale = require('./Scale');
var Packer = require('./Packer');

var Section = modelBase.define('Section',{
    ident : modelBase.Sequelize.STRING,
    name : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    state :  modelBase.Sequelize.INTEGER,
    nodeId: modelBase.Sequelize.STRING,
    jobIdent: modelBase.Sequelize.STRING
});
Section.hasMany(Scale);
Section.hasMany(Packer);
module.exports = Section;
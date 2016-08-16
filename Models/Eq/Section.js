/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Scale = require('./Scale');
var Packer = require('./Packer');

var Section = modelBase.define('Section',{
    Ident : modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    State :  modelBase.Sequelize.INTEGER
});
Section.hasMany(Scale);
Section.hasMany(Packer);
module.exports = Section;
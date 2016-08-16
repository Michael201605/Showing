/**
 * Created by lhf55 on 7/25/2016.
 */
var modelBase = require('../ModelBase');
var Language = modelBase.define('Language',{
    Ident : {type: modelBase.Sequelize.STRING},
    Name : modelBase.Sequelize.STRING,
    IsActive: modelBase.Sequelize.BOOLEAN
});
Language.sync();

module.exports = Language;
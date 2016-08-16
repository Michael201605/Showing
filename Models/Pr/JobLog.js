/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var JobLog = modelBase.define('JobLog',{
    Ident : {type: modelBase.Sequelize.STRING},
    ERPIdent : modelBase.Sequelize.STRING,
    JobIdent: modelBase.Sequelize.STRING,
    Name : modelBase.Sequelize.STRING,
    State :  modelBase.Sequelize.INTEGER,
    RecipeIdent : modelBase.Sequelize.STRING,
    LineIdent : modelBase.Sequelize.STRING
});

console.log('Joblog executed');
module.exports = JobLog;
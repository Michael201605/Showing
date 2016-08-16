/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Line = require('../Eq/Line');
var Job = require('./Job');
var IngredientComponent = require('./IngredientComponent');

var Recipe = modelBase.define('Recipe', {
    Ident: modelBase.Sequelize.STRING,
    Name: modelBase.Sequelize.STRING,
    Category: modelBase.Sequelize.INTEGER,
    IsTemplate: modelBase.Sequelize.BOOLEAN,
    JobIdent: modelBase.Sequelize.STRING,
    LineIdent: modelBase.Sequelize.STRING,
    SenderList: modelBase.Sequelize.STRING,
    ReciverList: modelBase.Sequelize.STRING
}, {
    classMethods: {
        CopyFromTemplate: function (lineIdent, newJob) {
            Recipe.findOne({
                where: {LineIdent: lineIdent}
            }).then(function (template) {
                var recipeInfo ={
                    Ident: newJob.Ident,
                    Name: template.Name,
                    Category: template.Category,

                };
                Recipe.create(template).then(function (newRecipe) {
                    newRecipe.JobIdent = newJob.Ident;
                    newRecipe.JobId = newJob.id;
                    newRecipe.IsTemplate = false;
                });
            });
        }
    }
});


Recipe.hasMany(IngredientComponent, {as: 'Senders'});
Recipe.hasMany(IngredientComponent, {as: 'Receivers'});
Line.hasOne(Recipe);
Recipe.belongsTo(Job);


module.exports = Recipe;
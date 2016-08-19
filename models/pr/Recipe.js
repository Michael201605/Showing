/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Line = require('../eq/Line');
var Job = require('./Job');
var IngredientComponent = require('./IngredientComponent');

var Recipe = modelBase.define('Recipe', {
    ident: modelBase.Sequelize.STRING,
    name: modelBase.Sequelize.STRING,
    category: modelBase.Sequelize.INTEGER,
    isTemplate: modelBase.Sequelize.BOOLEAN
}, {
    classMethods: {
        copyFromTemplate: function (lineIdent, newJob) {
            Recipe.findOne({
                where: {lineIdent: lineIdent}
            }).then(function (template) {
                var recipeInfo ={
                    ident: newJob.ident,
                    name: template.name,
                    category: template.category
                };
                Recipe.create(template).then(function (newRecipe) {
                    newRecipe.jobIdent = newJob.Ident;
                    newRecipe.jobId = newJob.id;
                    newRecipe.isTemplate = false;
                });
            });
        }
    }
});


Recipe.hasMany(IngredientComponent, {as: 'senders'});
Recipe.hasMany(IngredientComponent, {as: 'receivers'});
Line.hasOne(Recipe);
Recipe.belongsTo(Job);


module.exports = Recipe;
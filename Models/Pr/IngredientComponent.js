/**
 * Created by pi on 8/2/16.
 */
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var IngredientComponent = modelBase.define('IngredientComponent',{
    Ident : modelBase.Sequelize.STRING,
    Category : modelBase.Sequelize.INTEGER,
    ProductIdent : modelBase.Sequelize.INTEGER,
    TargetPercentage: modelBase.Sequelize.DECIMAL,
    TargetWeight: modelBase.Sequelize.DECIMAL,
    JobIdent : modelBase.Sequelize.STRING
});
IngredientComponent.belongsTo(Product);
module.exports = IngredientComponent;
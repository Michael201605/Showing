/**
 * Created by pi on 8/2/16.
 */
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var IngredientComponent = modelBase.define('IngredientComponent',{
    ident : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    productIdent : modelBase.Sequelize.INTEGER,
    targetPercentage: modelBase.Sequelize.DECIMAL,
    targetWeight: modelBase.Sequelize.DECIMAL,
    jobIdent : modelBase.Sequelize.STRING
});
IngredientComponent.belongsTo(Product);
module.exports = IngredientComponent;
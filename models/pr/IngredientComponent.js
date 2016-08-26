/**
 * Created by pi on 8/2/16.
 */
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');
var Product = require('./Product');
var Storage = require('../eq/Storage');
var IngredientComponent = modelBase.define('IngredientComponent',{
    ident : modelBase.Sequelize.STRING,
    category : modelBase.Sequelize.INTEGER,
    targetPercentage: modelBase.Sequelize.DECIMAL,
    targetWeight: modelBase.Sequelize.DECIMAL,
    storageIdent : modelBase.Sequelize.STRING
});
IngredientComponent.belongsTo(Product);
IngredientComponent.belongsTo(Storage);
module.exports = IngredientComponent;
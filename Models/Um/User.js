/**
 * Created by pi on 7/21/16.
 */
/**
 * Created by pi on 7/21/16.
 */
var modelBase = require('../ModelBase');

var properties = {
    UserName: modelBase.Sequelize.STRING,
    DisplayName: modelBase.Sequelize.STRING,
    Password: modelBase.Sequelize.STRING,
    IsAdministrator: modelBase.Sequelize.BOOLEAN,
    IsEngineer: modelBase.Sequelize.BOOLEAN
};

var User = modelBase.define('User', properties);

User.Instance.prototype.getUserWithoutPW = function () {
    var userStr = JSON.stringify(this);
    var userJSON = JSON.parse(userStr);
    delete userJSON.Password;
    console.log('userJSON');
    console.dir(userJSON);
    return userJSON;
};

console.log('User executed');
module.exports = User;
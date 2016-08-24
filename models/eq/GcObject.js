/**
 * Created by pi on 8/23/16.
 */
var modelBase = require('../ModelBase');
var GcObjectParameter = require('./GcObjectParameter');
var util = require('util');
var GcObject = modelBase.define('GcObject', {
    ident: modelBase.Sequelize.STRING,
    nodeId: modelBase.Sequelize.STRING,
    category: modelBase.Sequelize.STRING
});
GcObject.Instance.prototype.getGcObjectParameter = function () {

    var ElemGcObjectParameter = GcObjectParameter[this.category];
    if (ElemGcObjectParameter) {
        return new ElemGcObjectParameter();
    }
    else {
        return null;
    }

};
GcObject.Instance.prototype.getJsonObject = function (i18n) {

    var objectStr = JSON.stringify(this);
    return JSON.parse(objectStr);
};

GcObject.Instance.prototype.getClientEndObject = function (i18n) {

    var gcObjectparameter = this.getGcObjectParameter();
    var jsonObject = this.getJsonObject();
    inherit(jsonObject, gcObjectparameter);
    return jsonObject;
};
function  inherit(sub, parent) {
    for(var p in parent){
        if(parent.hasOwnProperty(p)){
            sub[p] = parent[p];
        }
    }
    return sub;
}
module.exports = GcObject;
/**
 * Created by pi on 8/26/16.
 */
var Line = require('../../models/eq/Line');
var Promise = require('promise');
var controllerManager = function (gcObjectAd) {
    this.controllers = [];
    var me = this;
    this.gcObjectAd = gcObjectAd;
    return new Promise(function (resolve, reject) {
        Line.findAll({
            where: {isEnabled : true}
        }).then(function (lines) {
            lines.forEach(function (line) {
                me.getController(line.controllerName);
            });
            resolve();
        });
    });

};

controllerManager.prototype = {
  getController : function (controllerName) {
      if(this.controllers[controllerName]){
          return this.controllers[controllerName];
      }else {
          var Controller = require('./' + controllerName);
          var controller = new Controller(this.gcObjectAd);
          this.controllers[controllerName] = controller;
          return controller;
      }
  }  
};

module.exports = controllerManager;
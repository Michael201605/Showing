/**
 * Created by pi on 8/2/16.
 */
var util = require('util');
var ControllerBase = require('./controllerBase');
var ProduceController = function ( gcObjectAdapter) {
    this.gcObjectAdapter = gcObjectAdapter;
    this.category = 0;
};
ProduceController.prototype ={

};
util.inherits( ProduceController, ControllerBase );
module.exports = ProduceController;
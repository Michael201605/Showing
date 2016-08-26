/**
 * Created by pi on 8/2/16.
 */
var extend = require('../utils');
var ControllerBase = require('./controllerBase');
var ProduceController = function ( gcObjectAdapter) {
    this.gcObjectAdapter = gcObjectAdapter;
    this.category = 0;
};
ProduceController.prototype ={

};
extend( ProduceController.prototype, ControllerBase.prototype );
module.exports = ProduceController;
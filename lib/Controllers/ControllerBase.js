/**
 * Created by pi on 8/2/16.
 */
var OPCUAAdapter = require('../adapters/OPCUAAdapter');
var ControllerBase = function () {
    this._lineIdent = '';
};
ControllerBase.prototype ={
    initialize:function () {

    },
    checkJob: function () {

    },
    startJob : function () {

    },
    suspendJob: function () {

    },
    stopJob:function () {
        
    },
    OPCUAAdapter: OPCUAAdapter,
    get LineIdent() {
        return this._lineIdent;
    },
    set LineIdent( value ) {
        this._lineIdent = value;
    }
};
module.exports = ControllerBase;
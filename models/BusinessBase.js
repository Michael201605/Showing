/**
 * Created by pi on 8/26/16.
 */
var GcObjectParameter = require('./eq/GcObjectParameter');
function BusinessBase() {

}

BusinessBase.prototype = {
    getJsonObject: function () {
        var jobStr = JSON.stringify(this);
        return JSON.parse(jobStr);
    },
    getGcObjectParameter: function () {

        var ElemGcObjectParameter = null;
        ElemGcObjectParameter = GcObjectParameter[this.category];
        // switch (this.category) {
        //     case 'SimpleMotor':
        //         ElemGcObjectParameter = GcObjectParameter.SimpleMotor;
        //         break;
        //     case 'FilterControl':
        //         ElemGcObjectParameter = GcObjectParameter.FilterControl;
        //         break;
        //     case 'HighLevel':
        //         ElemGcObjectParameter = GcObjectParameter.HighLevel;
        //         break;
        //     case 'BeltMonitor':
        //         ElemGcObjectParameter = GcObjectParameter.BeltMonitor;
        //         break;
        //     case 'SpeedMonitor':
        //         ElemGcObjectParameter = GcObjectParameter.SpeedMonitor;
        //         break;
        //     case 'ValveOpenClose':
        //         ElemGcObjectParameter = GcObjectParameter.ValveOpenClose;
        //         break;
        // }
        if (ElemGcObjectParameter) {
            console.log('created object.\n');
            return new ElemGcObjectParameter();
        }
        else {
            return null;
        }

    },
    getClientEndObject: function () {

        var gcObjectparameter = this.getGcObjectParameter();
        var jsonObject = this.getJsonObject();
        jsonObject.gcObjectParameter = gcObjectparameter;

        return jsonObject;
    }
};

module.exports = BusinessBase;
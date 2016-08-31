/**
 * Created by pi on 8/2/16.
 */
var controllerState = require('../stateAndCategory/controllerState');
var ControllerStateEnum = new Enum({
    Undefined: 0,
    Starting: 10,
    Running: 20,
    Error: 80
});
var Line = require('../../models/eq/Line');
var Section = require('../../models/eq/Section');
var Promise = require('promise');
var util = require("util");
var EventEmitter = require("events").EventEmitter;

var ControllerBase = function () {
    this.gcObjectAdapter = null;
    this.state = ControllerStateEnum.Undefined;
    this.on('GcsSectionStateChanged',this.gcsSectionStateChangeCallback);
    this.on('GcsLineStateChanged',this.gcsSectionStateChangeCallback);
};
util.inherits(ControllerBase, EventEmitter);
ControllerBase.prototype.initialize = function () {
    var lineNodeId = '';
    var gcObjectParameter = {};
    var promises = [];
    var parentNodeId = '';
    var me = this;
    return new Promise(function (resolve, reject) {
        Line.findAll({
            where: {category: this.category}
        }).then(function (lines) {
            lines.forEach(function (line) {
                lineNodeId = line.nodeId;
                gcObjectParameter = line.getGcObjectParameter();
                me.readGcObject(this.gcObjectAdapter, gcObjectParameter, parentNodeId, lineNodeId, promises);
                Promise.all(promises).then(function (pRes) {
                    this.state = ControllerStateEnum.Starting;
                    resolve();
                }, function (err) {
                    this.state = ControllerStateEnum.Error;
                    reject(err);
                });
            });
        });
    });
};
ControllerBase.prototype.checkJob = function (job) {
    return this._checkJob(job);
};
ControllerBase.prototype.startJob = function (job) {
    return this._startJob(job);
};
ControllerBase.prototype.suspendJob = function () {

};
ControllerBase.prototype.stopJob = function () {

};
ControllerBase.prototype.readParameter = function (gcObjectAd, nodeId, gcObjectParameter, promises) {
    var promise = new Promise(function (resolve, reject) {
        gcObjectAd.getItemsValue(nodeId, function (err, theNodeId, data) {
            log('D', 'nodeId: ' + nodeId);
            log('D', 'theNodeId: ' + theNodeId);
            if (!err) {
                log('D', 'value: ' + data.value.value);
                var pro = theNodeId.substring(theNodeId.lastIndexOf('.') + 1, theNodeId.length);
                log('D', 'pro: ' + pro);
                gcObjectParameter[pro] = data.value.value;
                resolve(gcObjectParameter[pro]);
            }
            else {
                log('D', err);
                reject(err);
            }

        });
    });
    promises.push(promise);
};
ControllerBase.prototype.readGcObject = function (gcObjectAd, gcObjectParameter, parentNodeId, elementNodeId, promises) {
    var nodeId = '';
    for (var p in gcObjectParameter) {
        log('D', 'Property  of gcObject: ' + p);
        if (gcObjectParameter.hasOwnProperty(p)) {
            log('D', p + ' type: ' + typeof (gcObjectParameter[p]));
            if (!(typeof (gcObjectParameter[p]) === 'object') || Array.isArray(gcObjectParameter[p])) {

                nodeId = parentNodeId + '.' + p;
                this.readParameter(gcObjectAd, nodeId, gcObjectParameter, promises);

            } else {
                parentNodeId = elementNodeId + '.' + p;
                log('D', 'parentNodeId: ' + parentNodeId);
                this.readGcObject(gcObjectAd, gcObjectParameter[p], parentNodeId, elementNodeId, promises);
            }
        }
    }


};
ControllerBase.prototype.gcsSectionStateChangeCallback = function (monitored_node, dataValueOfMonitor) {
    var segments = monitored_node.split('.');
    var sectionIdent = segments[2];

};
ControllerBase.prototype.gcsLineStateChangeCallback = function (monitored_node, dataValueOfMonitor) {

}
module.exports = ControllerBase;
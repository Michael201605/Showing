/**
 * Created by pi on 8/26/16.
 */
var Line = require('../../models/eq/Line');
var Section = require('../../models/eq/Section');
var Promise = require('promise');
var util = require("util");
var log = require('../log');
var EventEmitter = require("events").EventEmitter;
var GcsState = require('../stateAndCategory/gcsState');

var controllerManager = function (gcObjectAd, i18n, io) {
    this.controllers = [];
    var me = this;
    this.gcObjectAd = gcObjectAd;
    this.i18n = i18n;
    this.io = io;
    this.on('GcsSectionStateChanged', this.gcsSectionStateChangeCallback);
    this.on('GcsLineStateChanged', this.gcsLineStateChangeCallback);
    return new Promise(function (resolve, reject) {
        Line.findAll({
            where: {isEnabled: true}
        }).then(function (lines) {
            lines.forEach(function (line) {
                me.getController(line.controllerName);
            });
            resolve(me);
        });
    });

};
util.inherits(controllerManager, EventEmitter);
controllerManager.prototype.getController = function (controllerName) {
    if (this.controllers[controllerName]) {
        return this.controllers[controllerName];
    } else {
        var Controller = require('./' + controllerName);
        var controller = new Controller(this.gcObjectAd, this.i18n, this.io);
        this.controllers[controllerName] = controller;
        return controller;
    }
};
controllerManager.prototype.gcsSectionStateChangeCallback = function (monitored_node, dataValueOfMonitor) {
    var segments = monitored_node.split('.');
    var sectionIdent = segments[2];
    var state = segments[4];
    var newState;
    var me = this;
    Section.findOne({where: {ident: sectionIdent}}).then(function (theSection) {
        if (theSection) {
            Line.findOne({where: {id: theSection.LineId}}).then(function (theLine) {
                if (theLine) {
                    var controller = me.getController(theLine.controllerName);
                    var jobNodeId = theSection.nodeId + '.Parameter.JobId';
                    me.gcObjectAd.getItemsValue(jobNodeId, function (err, theNodeId, data) {
                        if (!err) {
                            if (state == 'StaStarted' && dataValueOfMonitor === true) {
                                newState = GcsState.Active;
                            }
                            if (state == 'StaStopped' && dataValueOfMonitor === true) {
                                newState = GcsState.Passive;
                            }
                            if (state == 'StaStopping' && dataValueOfMonitor === true) {
                                newState = GcsState.Emptying;
                            }
                            if (state == 'StaFault' && dataValueOfMonitor === true) {
                                newState = GcsState.Error;
                            }
                            if (newState) {
                                controller.sectionStateChangeCallback(theSection, {
                                    newState: newState,
                                    jobId: data.value.value
                                });
                                newState = null;
                            }

                        }
                        else {
                            log.error(me.i18n.__('No jobId in section.'));
                            //TODO
                            //notify main page
                        }
                    })

                } else {
                    log.error(me.i18n.__('theLine is not found.'));
                }
            })
        } else {
            log.error(me.i18n.__('theSection is not found.'));
        }
    });

};
controllerManager.prototype.gcsLineStateChangeCallback = function (monitored_node, dataValueOfMonitor) {
    var segments = monitored_node.split('.');
    var lineIdent = segments[2];
    var me = this;
    Line.findOne({where: {ident: lineIdent}}).then(function (theLine) {
        if (theLine) {
            var controller = me.getController(theLine.controllerName);
            controller.lineStateChangeCallback(theLine, {newState: dataValueOfMonitor});
        } else {
            log.error(me.i18n.__('theSection is not found.'));
        }
    });
}
module.exports = controllerManager;
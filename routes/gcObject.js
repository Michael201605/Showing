/**
 * Created by pi on 7/21/16.
 */
//var Job = require('../../Models/pr/Job');
var Line = require('../models/eq/Line');
var GcsState = require('../lib/stateAndCategory/gcsState');
var GcObject = require('../models/eq/GcObject');
var util = require('util');
var log = require('../lib/log');
var Promise = require('promise');
var events = require('events');
var eventEmitter = new events.EventEmitter();

module.exports = function (app, gcObjectAd, i18n,io) {
    app.get('/gcobject/:ident', function (req, res) {
        var ident = req.params.ident.substring(1);
        var clientEndGcObject = {};
        var parentNodeId = '';
        var promises = [];
        console.log('ident: ' + ident);
        //for mode,0:manual,1;automatic
        //for status,0: close, 1: open
        GcObject.findOne({
            where: {ident: ident}
        }).then(function (theGcObject) {

            if (theGcObject) {
                clientEndGcObject = theGcObject.getClientEndObject();
                readGcObject(gcObjectAd, clientEndGcObject.gcObjectParameter, parentNodeId, theGcObject.nodeId, promises);
                console.log('promises.length: ' + promises.length);
                Promise.all(promises).then(function (pRes) {
                    res.json(clientEndGcObject);
                    console.log('clientEndGcObject');
                    console.dir(clientEndGcObject);

                }, function (err) {
                    res.json(err);
                });


            }

        });


    });

    app.post('/gcobject', function (req, res) {
        var commandStr = req.body.commandStr;
        var parentNodeId = '';
        var promises = [];
        parentNodeId = '';
        console.log('commandStr:  ' + commandStr);
        var command = JSON.parse(commandStr);
        var data = {
            type: getType(command.value, gcObjectAd.DataType),
            value: command.value
        };
        console.log('nodeId to set: ' + command.nodeId);
        gcObjectAd.setItemValue(command.nodeId, data, function (error) {
            if (!error) {
                console.log('write successfully');

                res.json(null);
            } else {
                console.log('error: ' + error);
                res.json(error);
            }
        });
    });
    eventEmitter.addListener('nodeChanged', function (nodeData) {
        log('D', 'Event: nodeChanged');
        io.on('connection', function (socket) {
            socket.emit('GCObjectUpdate', nodeData);
        });
    });

};
function readParameter(gcObjectAd, nodeId, gcObjectParameter, promises) {
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
}
function getType(para, DataType) {
    var type = typeof(para);
    if (type === 'object' && Array.isArray(para)) {
        return DataType.Int64;
    }
    else if (type === 'boolean') {
        return DataType.Boolean;
    }
    else {
        return DataType.String;
    }
}


function readGcObject(gcObjectAd, gcObjectParameter, parentNodeId, elementNodeId, promises) {
    var nodeId = '';
    for (var p in gcObjectParameter) {
        log('D', 'Property  of gcObject: ' + p);
        if (gcObjectParameter.hasOwnProperty(p)) {
            log('D', p + ' type: ' + typeof (gcObjectParameter[p]));
            if (!(typeof (gcObjectParameter[p]) === 'object') || Array.isArray(gcObjectParameter[p])) {

                nodeId = parentNodeId + '.' + p;
                readParameter(gcObjectAd, nodeId, gcObjectParameter, promises);
                gcObjectAd.monitor_a_variable_node_value(nodeId, function (monitored_nodeId, dataValue, count) {
                    console.log('count: ' +count);
                    eventEmitter.emit('nodeChanged', {
                        monitored_nodeId: monitored_nodeId,
                        dataValue: dataValue
                    });
                });
            } else {
                parentNodeId = elementNodeId + '.' + p;
                log('D', 'parentNodeId: ' + parentNodeId);
                readGcObject(gcObjectAd, gcObjectParameter[p], parentNodeId, elementNodeId, promises);
            }
        }
    }


}

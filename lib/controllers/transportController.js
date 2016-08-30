/**
 * Created by pi on 8/2/16.
 */
var util = require('util');
var ControllerBase = require('./controllerBase');
var Recipe = require('../../models/pr/Recipe');
var Line = require('../../models/eq/Line');
var DataType = require('node-opcua').DataType;
var GcsState = require('../stateAndCategory/gcsState');
var GcsStateEnum = new Enum(GcsState);
var ProduceController = function (gcObjectAdapter, i18n) {
    this.i18n = i18n;
    this.gcObjectAdapter = gcObjectAdapter;
    this.category = 1;
};
ProduceController.prototype = {

    _startJob: function (job) {
        var rcvBinNo = -1;
        var sndBinNo = -1;
        var weightTotal = job.targetWeight;
        var line = job.getline();
        var firstSection = line.getSections()[0];
        var rcvBinNoNodeId = firstSection.nodeId + '.Parameter.RcvBinNo';
        var sndBinNoNodeId = firstSection.nodeId + '.Parameter.SndBinNo';
        var weightTotalNodeId = firstSection.nodeId + '.Parameter.WeightTotal';
        var data = {
            type: DataType.Int16,
            value: null
        };
        Recipe.findOne({
            where: {JobId: job.id}
        }).then(function (recipe) {
            var sender = recipe.getsenders()[0];
            var receiver = recipe.getreceivers()[0];
            sndBinNo = int.parse(sender.getStorage().ident);
            rcvBinNo = int.parse(receiver.getStorage().ident);
            data.value = rcvBinNo;
            this.gcObjectAdapter.setItemValue(rcvBinNoNodeId, data, function (error) {
                if (!error) {
                    console.log('write successfully: ' + rcvBinNoNodeId);

                    res.json(null);
                } else {
                    console.log('error: ' + error);
                    res.json(error);
                }
            });
            data.value = sndBinNo;
            this.gcObjectAdapter.setItemValue(sndBinNoNodeId, data, function (error) {
                if (!error) {
                    console.log('write successfully: ' + sndBinNoNodeId);

                    res.json(null);
                } else {
                    console.log('error: ' + error);
                    res.json(error);
                }
            });
            data = {
                type: DataType.Double,
                value: weightTotal
            };
            this.gcObjectAdapter.setItemValue(weightTotalNodeId, data, function (error) {
                if (!error) {
                    console.log('write successfully: ' + weightTotalNodeId);

                    res.json(null);
                } else {
                    console.log('error: ' + error);
                    res.json(error);
                }
            });
        });
    },
    _checkJob: function (job) {
        var errors =[];
        var error ='';
        if(job){
            if(job.targetWeight<=0){
                error = i18n.__('target weight should be positive.');
                errors.push(error);
            }
            if(job.LineId){
                Line.findOne({
                    where: {id:job.LineId}
                }).then(function (theLine) {
                    if(theLine.state === GcsState.Passive){

                    }else {
                        error = i18n.__('The line %s has job.', theLine.ident);
                        errors.push(error);
                    }

                });
            }
            else {
                error = i18n.__('target weight should be positive.');
                errors.push(error);
                return errors;
            }
        }
    }
};
util.inherits(ProduceController, ControllerBase);
module.exports = ProduceController;
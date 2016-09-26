/**
 * Created by pi on 7/21/16.
 */


var JobState = require('../lib/stateAndCategory/jobState');
var getTranslateOptions = require('../lib/tools/getTranslateOptions');
var Job = require('../models/pr/Job');
var Assembly = require('../models/pr/Assembly');
var AssemblyItem = require('../models/pr/AssemblyItem');
var Layer = require('../models/pr/Layer');
var LogisticUnit = require('../models/pr/LogisticUnit');
var utils = require('../lib/utils');
var log = require('../lib/log');

module.exports = function (app, i18n) {
    app.get('/station/dispensary/dispensaryJobList/:disIdent', function (req, res) {
        var disIdent = req.params.disIdent.substring(1);
        console.log('dispensary ident: ' + disIdent);
        Assembly.findAll({
            where: {
                location: disIdent,
                state: {$in: [1, 2]}
            }
        }).then(function (assemblys) {
            console.log('dispensary Jobs: ' + assemblys);
            res.render('station/dispensary/dispensaryJobList', {
                dispensaryJobs: assemblys
            });
        });

    });
    app.get('/station/dispensary/dispensaryJobDetail/:id', function (req, res) {
        var id = req.params.id.substring(1);
        console.log('assembly id: ' + id);
        Assembly.findOne({
            where: {
                id: id
            }
        }).then(function (theAssembly) {
            theAssembly.getAssemblyItems().then(function (assemblyItems) {
                var toAssemblyItems = [];
                var assemblyedItems = [];
                assemblyItems.forEach(function (item) {
                    if (item.isFinished) {
                        assemblyedItems.push(item);
                    }
                    else {
                        toAssemblyItems.push(item);
                    }
                });
                LogisticUnit.findAll({where: {location: theAssembly.location}}).then(function (stocks) {
                    res.render('station/dispensary/dispensaryJobDetail', {
                        assembly: theAssembly,
                        toAssemblyItems: toAssemblyItems,
                        assemblyedItems: assemblyedItems,
                        stocks: stocks
                    });
                })


            });


        });

    });
    app.get('/station/dispensary/scanBarcode/:location/:barcode', function (req, res) {
        var location = req.params.location.substring(1);
        var barcode = req.params.barcode.substring(1);
        var jobJson = {};
        var segments = barcode.split('_');
        var productIdent = '';
        var lotIdent = '';
        Layer.findOne({where:{sscc: barcode}}).then(function (theLayer) {
            if(theLayer){
                LogisticUnit.findOne({where:{id: theLayer.LogisticUnitId}}).then(function (theLogisticUnit) {
                    if(theLogisticUnit){
                        if(theLogisticUnit.location ==location){
                            res.json({info:i18n.__('barcode confirmed,please scale the weight.'),
                                isScale: true
                            });
                        }else if(theLogisticUnit.location === "WH"){
                            res.json({info:i18n.__('material is at raw warehouse,please transfer firstly.'),
                                isScale: false})
                        }
                    }
                });
            }else {
                res.json({error:i18n.__('Invalide barcode.')});
            }
        });
    });
    app.post('/station/dispensary/acceptWeight/:id', function (req, res) {

        var id = req.params.id.substring(1);
        var itemInfo = req.body.itemInfo;
        var jobJson = {};
        var segments = barcode.split('_');
        var productIdent = '';
        var lotIdent = '';
        AssemblyItem.findOne({where:{id: id}}).then(function (theItem) {
            if(theItem){
                theItem.update(itemInfo).then(function (updatedItem) {
                    res.json({info:i18n.__('update successfully')});
                });
            }else {
                res.json({error:i18n.__('Invalide barcode.')});
            }
        });
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {

        console.log('is Authenticated!!!');
        return next();
    }


    // if they aren't redirect them to the home page
    res.redirect('/login');
}
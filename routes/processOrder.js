/**
 * Created by pi on 7/21/16.
 */
var ProcessOrder = require('../models/pr/ProcessOrder');
var Product = require('../models/pr/Product');
var Company = require('../models/eq/Company');

var WarehousePackingType = require('../lib/stateAndCategory/warehousePackingType');
var getTranslateOptions = require('../lib/tools/getTranslateOptions');
var labelPrintManager = require('../lib/labelPrintManager');

module.exports = function (app, i18n) {
    app.get('/order/process/ProcessOrderList/:state', function (req, res) {
        var state = req.params.state.substring(1);
        console.log('global.i18n: ' + global.i18n);
        ProcessOrder.findAll({
            where: {State: state}
        }).then(function (processOrders) {
            console.log('processOrders: ' + processOrders);
            var processOrdersStr = JSON.stringify(processOrders);
            res.render('order/process/processOrderList', {
                processOrders: processOrders,
                state: state
            });
        });

    });
    app.get('/order/process/createProcessOrder', function (req, res) {
        var info = {
            ident: 'TODO',
            erpIdent: '',
            name: 'processOrder',
            isTemplate: false,
            state: 10,
            targetWeight: 0,
            packSize: 0,
            productIdent: '',
            mixerIdent: '',
            lineIdent: '',
            mixingTime: 0,
            isMedicatedOrder: false
        };
        console.log('try to create new ProcessOrder.... ');
        ProcessOrder.create(info).then(function (newProcessOrder) {
            console.log('newProcessOrder: ' + newProcessOrder);
            res.json({processOrder: newProcessOrder});
        });
    });
    app.post('/order/process/processOrderList/deleteProcessOrder', function (req, res) {
        var toDeleteProcessOrderIdsStr = req.body.toDeleteProcessOrderIdsStr;
        console.log('toDeleteProcessOrderIdsStr:  ' + toDeleteProcessOrderIdsStr);
        var toDeleteProcessOrderIds = JSON.parse(toDeleteProcessOrderIdsStr);
        ProcessOrder.destroy({
            where: {
                id: {
                    $in: toDeleteProcessOrderIds
                }
            }
        }).then(function (message) {
            res.json(message);
        });
    });
    app.get('/order/process/processOrderDetail/:id', function (req, res) {
        var id = req.params.id.substring(1);


        ProcessOrder.findOne({
            where: {id: id}
        }).then(function (processOrder) {

            var packingCategoryStr = JSON.stringify(getTranslateOptions(WarehousePackingType, i18n));
            console.log('packingCategoryStr: ' + packingCategoryStr);
            Product.findAll({where:{category: 1}}).then(function (products) {
                var productsStr = JSON.stringify(products);
                res.render('order/process/processOrderDetail', {
                    processOrder: processOrder.getJsonObject(),
                    product: productsStr
                });
            });


        });

    });

    app.post('/order/process/processOrderDetail/:id', function (req, res) {
        // for(var p in req){
        //     console.log('property of req: '+ p);
        // }
        var id = req.params.id.substring(1);

        var processOrderInfo = req.body.processOrderInfo;
        console.log('processOrder: ');
        console.dir(processOrderInfo);
        try {
            ProcessOrder.findOne({
                where: {id: id}
            }).then(function (theProcessOrder) {
                theProcessOrder.update(processOrderInfo).then(function () {
                    console.log("save successfully");
                    res.json({info: i18n.__("save successfully")});
                });
            });
        }
        catch (err) {
            res.json({error: i18n.__(err)});
        }


    });
    app.get('/order/process/checkProcessOrder/:id', function (req, res) {
        var id = req.params.id.substring(1);

        ProcessOrder.findOne({
            where: {id: id}
        }).then(function (theProcessOrder) {
            theProcessOrder.checkOrder(i18n).then(function (info) {
                res.json({
                    update: {state:80},
                    info: i18n.__('check OK.')
                });
            }, function (errors) {
                res.json({
                    errors: errors
                });
            });
        });

    });
    app.get('/order/process/releaseProcessOrder/:id', function (req, res) {
        var id = req.params.id.substring(1);

        ProcessOrder.findOne({
            where: {id: id}
        }).then(function (theProcessOrder) {
            theProcessOrder.releaseOrder(i18n).then(function (info) {
                res.json({
                    update: {state:80},
                    info: i18n.__('release successfully.')
                });
            }, function (errInfo) {
                if(Array.isArray(errInfo)){
                    res.json({
                        errors: errInfo
                    });
                }else {
                    res.json({
                        error: errInfo
                    });
                }

            });
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
/**
 * Created by pi on 7/21/16.
 */
var Receipt = require('../models/pr/Receipt');
var Product = require('../models/pr/Product');
var Company = require('../models/eq/Company');

var WarehousePackingType = require('../lib/stateAndCategory/warehousePackingType');
var getTranslateOptions = require('../lib/tools/getTranslateOptions');


module.exports = function (app, i18n) {
    app.get('/warehouse/receiptList/:state',isLoggedIn, function (req, res) {
        var state = req.params.state.substring(1);

        Receipt.findAll({
            where: {State: state}
        }).then(function (receipts) {
            console.log('receipts: ' + receipts);
            var receiptsStr = JSON.stringify(receipts);
            res.render('warehouse/receiptList', {
                receipts: receiptsStr,
                state: state
            });
        });

    });
    app.get('/warehouse/createReceipt', isLoggedIn, function (req, res) {
        var info = {
            Ident: 'newReceipt',
            Name: 'Raw',
            Visible: true,
            State: 10,
        };
        console.log('try to create new receipt.... ');
        Receipt.create(info).then(function (newReceipt) {
            console.log('newReceipt: ' + newReceipt);
            res.json(newReceipt);
        });
    });
    app.get('/warehouse/receiptDetail/:id',isLoggedIn, function (req, res) {
        var id = req.params.id.substring(1);


        Receipt.findOne({
            where: {id: id}
        }).then(function (receipt) {
            var receiptStr = JSON.stringify(receipt);
            var packingCategoryStr = JSON.stringify(getTranslateOptions(WarehousePackingType, i18n));
            console.log('packingCategoryStr: ' + packingCategoryStr);
            Product.findAll().then(function (products) {
                var productsStr = JSON.stringify(products);
                console.log('productsStr: ' + productsStr);
                Company.findAll().then(function (companys) {
                    var companysStr = JSON.stringify(companys);
                    console.log('companysStr: ' + companysStr);
                    res.render('warehouse/receiptDetail', {
                        receipt: receiptStr,
                        packingCategory: packingCategoryStr,
                        products: productsStr,
                        companys: companysStr
                    });
                });
            });


        });

    });

    app.post('/warehouse/receiptDetail',isLoggedIn, function (req, res) {
        // for(var p in req){
        //     console.log('property of req: '+ p);
        // }
        var receiptStr = req.body.receiptStr;
        console.log('receiptStr: ' + receiptStr);
        var receiptFromClient = JSON.parse(receiptStr);
        console.log('receiptFromClient: ' + receiptFromClient);
        Receipt.findOne({
            where: {id: receiptFromClient.id}
        }).then(function (theReceipt) {
            theReceipt.update(receiptFromClient).then(function () {
                console.log("save successfully");
                res.json("save successfully");
            });
        });

    });
    app.get('/warehouse/station/receiptList',isLoggedIn, function (req, res) {

        Receipt.findAll({
            where: {State: 10}
        }).then(function (receipts) {
            console.log('receipts: ' + receipts);
            var receiptsStr = JSON.stringify(receipts);
            res.render('warehouse/station/receiptList', {
                receipts: receiptsStr,
                state: 10
            });
        });

    });
    app.get('/warehouse/station/receiptDetail/:id',isLoggedIn, function (req, res) {
        var id = req.params.id.substring(1);


        Receipt.findOne({
            where: {id: id}
        }).then(function (receipt) {
            var receiptStr = JSON.stringify(receipt);
            var packingCategoryStr = JSON.stringify(getTranslateOptions(WarehousePackingType, i18n));
            console.log('packingCategoryStr: ' + packingCategoryStr);
            Product.findAll().then(function (products) {
                var productsStr = JSON.stringify(products);
                console.log('productsStr: ' + productsStr);
                Company.findAll().then(function (companys) {
                    var companysStr = JSON.stringify(companys);
                    console.log('companysStr: ' + companysStr);
                    res.render('warehouse/station/receiptDetail', {
                        receipt: receiptStr,
                        packingCategory: packingCategoryStr,
                        products: productsStr,
                        companys: companysStr
                    });
                });
            });


        });

    });
    app.get('/warehouse/confirmReceipt/:id',isLoggedIn, function (req, res) {
        var id = req.params.id.substring(1);

        Receipt.findOne({
            where: {id: id}
        }).then(function (theReceipt) {
            var errors = theReceipt.confirmReceipt(i18n);
            if(errors){
                res.json({
                    errors: JSON.stringify(errors)
                });
            }else {
                res.render('warehouse/receiptLabel', {
                    receipt: receiptStr,
                    packingCategory: packingCategoryStr
                });
            }


        });

    });
    app.get('/warehouse/receiptLabel/:id',isLoggedIn, function (req, res) {
        var id = req.params.id.substring(1);

        Receipt.findOne({
            where: {id: id}
        }).then(function (theReceipt) {
            // for(var pro in theReceipt){
            //     console.log('Property of receipt: ' + pro);
            // }
            var data ={Lot: theReceipt.LOT};
            console.log('prodcut: ' + theReceipt.getProduct());
            theReceipt.getProduct().then(function (product) {
                data.Ident =product.Ident;
                data.Name =product.Name;
                theReceipt.getSupplier().then(function (supplier) {
                    data.SupplierName =supplier.Name;
                    console.log('data: '+ JSON.stringify(data));
                    res.render('warehouse/receiptLabel', {
                        data: data
                    });
                });
            });



        });

    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){

        console.log('is Authenticated!!!');
        return next();
    }


    // if they aren't redirect them to the home page
    res.redirect('/login');
}
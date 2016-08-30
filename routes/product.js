/**
 * Created by pi on 7/21/16.
 */
//var Job = require('../../Models/pr/Job');
var Product = require('../models/pr/Product');
var StorageCategory = require('../lib/stateAndCategory/storageCategory');
module.exports = function (app, i18n) {
    app.get('/product/productList', function (req, res) {
        Product.findAll().then(function (Products) {
            console.log('storages: ' + storages);
            res.render('storage/StorageList',
                {
                    storages: JSON.stringify(storages)
                });
        });

    });
    app.get('/product/productList/createProduct', function (req, res) {
        var productInfo = {
            Ident: 'newStorage',
        };
        Product.create(productInfo).then(function (newProduct) {
            console.log('newLine: ' + JSON.stringify(newProduct));
            // console.log('newRecipe.save: ' +newRecipe.save);
            res.json(newProduct);
        });
    });
    app.post('/product/productList/deleteProduct', function (req, res) {
        var toDeleteProductIdsStr = req.body.toDeleteProductIdsStr;
        console.log('toDeleteProductIdsStr:  ' + toDeleteProductIdsStr);
        var toDeleteProductIds = JSON.parse(toDeleteProductIdsStr);
        Product.destroy({
            where: {
                id: {
                    $in: toDeleteProductIds
                }
            }
        }).then(function (message) {
            res.json(message);
        });
    });

    app.get('/product/productDetail/:id', function (req, res) {
        var id = req.params.id.substring(1);
        var storageStr='';
        var error ='';
        console.log('storage id: ' + id);
        Product.findOne({
            where: {id: id}
        }).then(function (theProduct) {
            console.log('storage: ');
            console.dir(theProduct);
            if (theProduct) {
                res.render('product/productDetail',
                    {
                        storage: theProduct.getJsonObject()

                    });
            }
            else {

                error = i18n.__('storage not found');
                console.log(error);
                res.render('product/productDetail',
                    {
                        error: error

                    });
            }


        });
    });
    app.get('/product/getProduct/:id', function (req, res) {
        var id = req.params.id.substring(1);
        var storageStr='';
        var error ='';
        console.log('storage id: ' + id);
        Product.findOne({
            where: {id: id}
        }).then(function (theProduct) {
            console.log('product: ');
            console.dir(theProduct);
            if(theProduct){
                res.json(
                    {
                        product: theProduct.getJsonObject()

                    });

            }else {
                res.json(
                    {
                        error: i18n.__('Product: %s is not found', id)

                    });
            }

        });
    });
    app.post('/product/productDetail', function (req, res) {
        // for(var p in req){
        //     console.log('property of req: '+ p);
        // }
        var productStr = req.body.productStr;
        console.log('productStr: ' + productStr);
        var productFromClient = JSON.parse(productStr);
        console.log('productFromClient: ' + productFromClient);
        Product.findOne({
            where: {id: productFromClient.id}
        }).then(function (theProduct) {
            theProduct.update(productFromClient).then(function () {
                console.log("save successfully");
                res.json("save successfully");
            });
        });

    });


}
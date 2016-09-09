/**
 * Created by Operator on 8/4/2016.
 */
var Promise = require('promise');

//------------------------------------
//Module
var Filler = require('./eq/Filler');
var Discharger = require('./eq/Discharger');
var Storage = require('./eq/Storage');
var Company = require('./eq/Company');

var Scale = require('./eq/Scale');
var Mixer = require('./eq/Mixer');
var Packer = require('./eq/Packer');
var Section = require('./eq/Section');
var Line = require('./eq/Line');
var GcObject = require('./eq/GcObject');

var Product = require('./pr/Product');
var IngredientComponent = require('./pr/IngredientComponent');
var Recipe = require('./pr/Recipe');
var Job = require('./pr/Job');
var JobLog = require('./pr/JobLog');
var LogisticUnit = require('./pr/LogisticUnit');
var Receipt = require('./pr/Receipt');
var Layer = require('./pr/Layer');
var GroupUser = require('./um/GroupUser');
var UserGroup = require('./um/UserGroup');
var User = require('./um/User');
var AccessRight = require('./um/AccessRight');
var LotLog = require('./pr/LotLog');
var LayerLog = require('./pr/LayerLog');
var TraceLog = require('./pr/TraceLog');

UserGroup.sync().then(function () {

    User.sync().then(function () {
        GroupUser.sync();

    });
    AccessRight.sync().then(function () {

    });
});

Company.sync().then(function () {

});


Product.sync().then(function () {


    Storage.sync().then(function () {
        Filler.sync();


    });

    LogisticUnit.sync().then(function () {
        Layer.sync();
    });
    Receipt.sync();
});


Line.sync().then(function () {
    Job.sync().then(function () {
        Recipe.sync().then(function () {
            IngredientComponent.sync();
        });
    });
    Section.sync().then(function () {
        Scale.sync().then(function () {
            Discharger.sync();
        });
        Mixer.sync();
        Packer.sync();
    });

});

JobLog.sync();
LotLog.sync();
LayerLog.sync();
TraceLog.sync();
GcObject.sync();
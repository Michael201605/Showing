/**
 * Created by Operator on 8/4/2016.
 */
var Promise = require('promise');

//------------------------------------
//Module
var modelBase = require('./ModelBase');
var Filler = require('./Eq/Filler');
var Discharger = require('./Eq/Discharger');
var Storage = require('./Eq/Storage');
var Company = require('./Eq/Company');

var Scale = require('./Eq/Scale');
var Mixer = require('./Eq/Mixer');
var Packer = require('./Eq/Packer');
var Section = require('./Eq/Section');
var Line = require('./Eq/Line');


var Product = require('./Pr/Product');
var IngredientComponent = require('./Pr/IngredientComponent');
var Recipe = require('./Pr/Recipe');
var Job = require('./Pr/Job');
var JobLog = require('./Pr/JobLog');
var LogisticUnit = require('./Pr/LogisticUnit');
var Receipt = require('./Pr/Receipt');
var Layer = require('./Pr/Layer');
var GroupUser = require('./Um/GroupUser');
var UserGroup = require('./Um/UserGroup');
var User = require('./Um/User');
var AccessRight = require('./Um/AccessRight');

var LineCategory = require('../lib/StateAndCategory/LineCategory');
var GcsState = require('../lib/StateAndCategory/GcsState');
// Storage.hasMany(Filler);
// Storage.hasMany(Discharger);
// Storage.belongsTo(Product);
//
// Scale.hasMany(Discharger);
// Section.hasMany(Scale);
// Mixer.belongsTo(Section);
// Section.hasMany(Packer);
// Line.hasMany(Section);
//
// Job.belongsTo(Line,{as: 'line'});
// IngredientComponent.belongsTo(Product);
// Recipe.hasMany(IngredientComponent,{as: 'Senders'});
// Recipe.hasMany(IngredientComponent,{as: 'Receivers'});
// Line.hasOne(Recipe);
// Recipe.belongsTo(Job);
// Recipe.hasOne(Job);

UserGroup.sync().then(function () {
    // UserGroup.bulkCreate([
    //     {
    //         Ident: 'AdminGroup',
    //         Name: 'AdminGroup'
    //     },
    //     {
    //         Ident: 'CentralGroup',
    //         Name: 'CentralGroup'
    //     },
    //     {
    //         Ident: 'IntakeGroup',
    //         Name: 'IntakeGroup'
    //     }
    //
    // ]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    //     return UserGroup.findAll();
    // }).then(function(usergroups) {
    //     console.log(usergroups); // ... in order to get the array of user objects
    // });
    User.sync().then(function () {
        GroupUser.sync();
        // User.bulkCreate([
        //     {
        //         UserName: 'FLCos',
        //         DisplayName: 'FLCos Engineer' ,
        //         Password: '123456',
        //         IsAdministrator:true,
        //         IsEngineer: true
        //     },
        //     {
        //         UserName: 'Admin',
        //         DisplayName: 'Admin' ,
        //         Password: '123456',
        //         IsAdministrator:true,
        //         IsEngineer: false
        //     }
        // ]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
        //     return User.findAll();
        // }).then(function(users) {
        //     console.log(users); // ... in order to get the array of user objects
        // });
    });
    AccessRight.sync().then(function () {
        // AccessRight.bulkCreate([
        //     {
        //         Ident: 'MainPage',
        //         Name: 'MainPage'
        //     },
        //     {
        //         Ident: 'IntakePage',
        //         Name: 'IntakePage'
        //     }
        // ]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
        //     return AccessRight.findAll();
        // }).then(function(acessRights) {
        //     console.log(acessRights); // ... in order to get the array of user objects
        // });
    });
});

Company.sync().then(function () {
    // Company.bulkCreate([
    //     {
    //         Ident: '1001',
    //         Name: 'Muehlbauer' ,
    //         Category: 0,
    //         Address:'Wuxi China'
    //     },
    //     {
    //         Ident: '1002',
    //         Name: 'Buhler' ,
    //         Category: 0,
    //         Address:'Swizerland'
    //     }
    // ]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    //     return Company.findAll();
    // }).then(function(companys) {
    //     console.log(companys) // ... in order to get the array of user objects
    // });
});


Product.sync().then(function () {
    // Product.bulkCreate([
    //     {
    //         Ident: 'r1001',
    //         Name: 'Corn' ,
    //         Category: 0
    //     },
    //     {
    //         Ident: 'r1002',
    //         Name: 'Buhler' ,
    //         Category: 0
    //     }
    // ]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    //     return Product.findAll();
    // }).then(function(products) {
    //     console.log(products) // ... in order to get the array of user objects
    // });

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
    // Line.bulkCreate([
    //     {
    //         Ident: 'INT1',
    //         Name: 'INT1' ,
    //         Category: LineCategory.ContinuousTransportLine,
    //         State:GcsState.Passive
    //     },
    //     {
    //         Ident: 'INT2',
    //         Name: 'INT2' ,
    //         Category: LineCategory.ContinuousTransportLine,
    //         State:GcsState.Passive
    //     },
    //     {
    //         Ident: 'MIX1',
    //         Name: 'MIX1' ,
    //         Category: LineCategory.BatchMixingLine,
    //         State:GcsState.Passive
    //     }
    // ]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    //     return Line.findAll();
    // }).then(function(lines) {
    //     console.log(lines) // ... in order to get the array of user objects
    // });

});

JobLog.sync();




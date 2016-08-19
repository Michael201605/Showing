/**
 * Created by pi on 8/19/16.
 */
var Filler = require('./eq/Filler');
var Discharger = require('./eq/Discharger');
var Storage = require('./eq/Storage');
var Company = require('./eq/Company');

var Scale = require('./eq/Scale');
var Mixer = require('./eq/Mixer');
var Packer = require('./eq/Packer');
var Section = require('./eq/Section');
var Line = require('./eq/Line');


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
var LineCategory = require('../lib/stateAndCategory/lineCategory');
var GcsState = require('../lib/stateAndCategory/gcsState');
var bcrypt = require('bcrypt-nodejs');


UserGroup.bulkCreate([
    {
        ident: 'AdminGroup',
        name: 'AdminGroup'
    },
    {
        ident: 'CentralGroup',
        name: 'CentralGroup'
    },
    {
        ident: 'IntakeGroup',
        name: 'IntakeGroup'
    }

]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    return UserGroup.findAll();
}).then(function(usergroups) {
    console.log(usergroups); // ... in order to get the array of user objects
});

User.bulkCreate([
    {
        userName: 'FLCos',
        displayName: 'FLCos Engineer' ,
        password: bcrypt.hashSync('123456', null, null),
        isAdministrator:true,
        isEngineer: true
    },
    {
        userName: 'Admin',
        displayName: 'Admin' ,
        password: bcrypt.hashSync('123456', null, null),
        isAdministrator:true,
        isEngineer: false
    }
]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    return User.findAll();
}).then(function(users) {
    console.log(users); // ... in order to get the array of user objects
});

AccessRight.bulkCreate([
    {
        ident: 'MainPage',
        name: 'MainPage'
    },
    {
        ident: 'IntakePage',
        name: 'IntakePage'
    }
]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    return AccessRight.findAll();
}).then(function(acessRights) {
    console.log(acessRights); // ... in order to get the array of user objects
});

Company.bulkCreate([
    {
        ident: '1001',
        name: 'Muehlbauer' ,
        category: 0,
        address:'Wuxi China'
    },
    {
        ident: '1002',
        name: 'Buhler' ,
        category: 0,
        address:'Swizerland'
    }
]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    return Company.findAll();
}).then(function(companys) {
    console.log(companys) // ... in order to get the array of user objects
});

Product.bulkCreate([
    {
        ident: 'r1001',
        name: 'Corn' ,
        category: 0
    },
    {
        ident: 'r1002',
        name: 'Buhler' ,
        category: 0
    }
]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    return Product.findAll();
}).then(function(products) {
    console.log(products); // ... in order to get the array of user objects
});

Line.bulkCreate([
    {
        ident: 'INT1',
        name: 'INT1' ,
        category: LineCategory.ContinuousTransportLine,
        state:GcsState.Passive
    },
    {
        ident: 'INT2',
        name: 'INT2' ,
        category: LineCategory.ContinuousTransportLine,
        state:GcsState.Passive
    },
    {
        ident: 'MIX1',
        name: 'MIX1' ,
        category: LineCategory.BatchMixingLine,
        state:GcsState.Passive
    }
]).then(function() { // Notice: There are no arguments here, as of right now you'll have to...
    return Line.findAll();
}).then(function(lines) {
    console.log(lines) // ... in order to get the array of user objects
});
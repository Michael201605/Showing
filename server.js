/**
 * Created by pi on 8/15/16.
 */
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 3000;
var i18n = require('i18n');
var passport = require('passport');
var flash    = require('connect-flash');
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout:'main',
        helpers: {
            section: function (name, options) {
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            __: function() { return i18n.__.apply(this, arguments); },
            __n: function() { return i18n.__n.apply(this, arguments); }
        }
    });
var menus = require('./lib/tools/Menu');
var navs = require('./lib/tools/Navigation');
// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration

i18n.configure({
    // setup some locales - other locales default to en silently
    locales:['en', 'zh'],

    // fall back from Dutch to German
    fallbacks:{'nl': 'de'},

    // you may alter a site wide default locale
    defaultLocale: 'de',

    // sets a custom cookie name to parse locale settings from - defaults to NULL
    cookie: 'locale',

    // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
    queryParameter: 'lang',

    // where to store json files - defaults to './locales' relative to modules directory
    directory: __dirname + '/locales',

    // controll mode on directory creation - defaults to NULL which defaults to umask of process user. Setting has no effect on win.
    directoryPermissions: '755',

    // watch for changes in json files to reload locale on updates - defaults to false
    autoReload: true,

    // whether to write new locale information to disk - defaults to true
    updateFiles: true,

    // sync locale information accros all files - defaults to false
    syncFiles: false,

    // what to use as the indentation unit - defaults to "\t"
    indent: "\t",

    // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
    extension: '.json',

    // setting prefix of json files name - default to none '' (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
    prefix: '',

    // enable object notation
    objectNotation: false,

    // // setting of log level DEBUG - default to require('debug')('i18n:debug')
    // logDebugFn: function (msg) {
    //     console.log('debug', msg);
    // },

    // setting of log level WARN - default to require('debug')('i18n:warn')
    logWarnFn: function (msg) {
        console.log('warn', msg);
    },

    // setting of log level ERROR - default to require('debug')('i18n:error')
    logErrorFn: function (msg) {
        console.log('error', msg);
    },

    // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
    register: global,

    // hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
    // note that this will *not* overwrite existing properties with the same name
    api: {
        '__': 't',  //now req.__ becomes req.t
        '__n': 'tn' //and req.__n can be called as req.tn
    }
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// required for passport
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(i18n.init);
app.use(express.static(__dirname + '/public'));

app.use(function (req,res,next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    if(!res.locals.partials) res.locals.partials = {};
    // for(var o in i18n)
    // {
    //     console.log("i18n property: " +o);
    // }
    //console.log("localed in i18n: " +i18n.getLocale(req));
    i18n.setLocale(i18n, req.locale);
    res.locals.partials.menus = menus(i18n);
    res.locals.partials.navigations = navs(res.locals.partials.menus);
    //console.log("Navigation's length: " +res.locals.partials.navigations.length );

    //console.log("showTest: " +res.locals.showTests);
    //console.log("locale: "+ res.locals.locale);
    // console.log('warehouse from translate menu : ' + res.locals.partials.menus[0].name);
    // console.log('warehouse: ' + i18n.__('Warehouse'));
    // console.log('warehouse: ' + i18n.__('text to test'));
    console.log('processing request for "' + req.url + '"....');

    next();
});
// routes ======================================================================
require('./routes/index')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/job')(app, i18n);
require('./routes/line')(app, i18n);
require('./routes/receipt')(app, i18n);
require('./routes/recipe')(app, i18n);
require('./routes/jobLog')(app, i18n);
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

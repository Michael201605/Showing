/**
 * Created by pi on 7/19/16.
 */

var express = require('express'),
    i18n = require('i18n'),
    bodyParser     = require('body-parser'),
    cookieParser   = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

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

var flash    = require('connect-flash');

var menus = require('./lib/tools/Menu');
var navs = require('./lib/tools/Navigation');
// var jobpages = require('./lib/PagesHandler/JobPagesHandler/jobPages');
// var jobLogpages = require('./lib/PagesHandler/JobPagesHandler/jobLogPages');
// var recipePages = require('./lib/PagesHandler/JobPagesHandler/recipePages');
// var linePages = require('./lib/PagesHandler/LinePagesHandler/linePages');
// var warehousePages = require('./lib/PagesHandler/WarehousePagesHandler/warehousePages');
// var User = require('./Models/Um/User');

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

require('./config/passport')(passport); // pass passport for configuration

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(i18n.init);
app.set('port', process.env.PORT || 3000);
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



// app.use(require('body-parser')());
// app.use(require('cookie-parser')(credentials.cookieSecret));
// app.use(require('express-session')());
// app.get('/', function(req, res){
//     console.log('isAuthenticated: ' + req.isAuthenticated());
//     res.render('home');
// });
require('./routes/index')(app, passport);

//
// jobpages(app,i18n);
// jobLogpages(app);
// recipePages(app,i18n);
// linePages(app,i18n);
// warehousePages(app,i18n);


app.get('/about', function(req, res){
    res.render('about', {

        pageTestScript: '/qa/tests-about.js'
    });
});
app.get('/zh', function(req, res){
    console.log('Chinese------------');
    res.locals.locale = 'zh';

    res.cookie('locale', 'zh', { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});
app.get('/en', function (req, res) {
    res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});
// app.get('/login',function (req, res) {
//     res.render('login');
// });
// app.post('/login',
//     passport.authenticate('local', { failureRedirect: '/login' }),
//     function(req, res) {
//         res.redirect('/');
//     }
// );
// app.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
// });
// 定制404 页面
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

server.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});


// i18n.configure({
//     locales: ['zh', 'en'],
//     fallbacks:{'nl': 'en'},
//     defaultLocale: 'zh',
//     cookie: 'locale',
//     queryParameter: 'lang',
//     directory: __dirname + '/locales',
//     directoryPermissions: '755',
//     autoReload: true,
//     updateFiles: true,
//     api: {
//         '__': '__',  //now req.__ becomes req.__
//         '__n': '__n' //and req.__n can be called as req.__n
//     }
// });


// io.on('connection', function (socket) {
//
//     socket.on('message_to_server', function (data) {
//         console.log("received message from client.\n" +data['message']);
//         // we have a reference to socket from the closure above ^
//         socket.emit("message_to_client" , { message: data["message"] });
//     });
// });

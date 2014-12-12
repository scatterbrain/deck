var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var configDB = require('./config/database.js');

var routes = require('./routes/index');
var users = require('./routes/users');
var comments = require('./routes/comments');
var documents = require('./routes/documents');
var auth = require('./routes/auth');
var session = require('express-session');
var util = require('util');

var app = express();

// view engine setup
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbsutils.registerWatchedPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport); // pass passport for configuration

app.use(session({
  secret: '8be1f61e73ef84cc444899c445ac678825ea0b5b',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Pass {{user}} variable to all templates
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// routes ======================================================================
app.use('/', routes);
app.use('/users', users);
app.use('/comments', comments);
app.use('/documents', documents);
app.use('/auth', auth(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

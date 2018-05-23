var CONST = require('./config.js')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var filterRouter = require('./routes/filter');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
var mongoose = require('mongoose');
mongoose.connect(CONST.CONNECTION_STRING);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'));


// view engine setup
app.set('views','./views');
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index.html', indexRouter);
app.use('/product.html', productRouter);
app.use('/filter.html', filterRouter);
app.use('/admin.html',adminRouter);
app.use('/login.html',loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
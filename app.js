var CONST = require('./config.js')
const exphbs = require('express-handlebars');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var business = require('./controller/business');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
var mongoose = require('mongoose');
mongoose.connect(CONST.CONNECTION_STRING);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'));


// view engine setup
app.set('views', './views');
app.engine('.hbs', exphbs({
  defaultLayout: 'layout.hbs',
  extname: '.hbs',
  helpers: require('./views/helpers/helpers')
}));
app.set('view engine', 'hbs');


// Session setup
app.use(session({
  secret: 'sdfl$lkdjflK$lkjdf@L@Klkdjf4',
  cookie: {
    maxAge: 1000 * 60 * 5
  }
  // resave: false,
  // saveUninitialized: false,
}))

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (name, done) {
  business.GetUser(name, function (user) {
    if (user != null && user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
});

passport.use(new LocalStrategy(function (username, password, done) {
  business.GetUser(username, function (user) {
    if (user != null && user && user.username == username && user.password == password) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));


// Generate new cart for each sesison
app.use(function (req, res, next) {
  if (req.session.cartCreated !== true) {
    business.GenerateCart(req.sessionID, function (success) {
      if (success) {
        req.session.cartCreated = true;
      }
      console.log("Generate cart: " + success.toString());
      next();
    })
  } else {
    next();
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// ===================================================
var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var productListRouter = require('./routes/product-list');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var checkoutRouter = require('./routes/checkout');
var cartRouter = require('./routes/cart');
var registerRouter = require('./routes/register');
var accountSettingsRouter = require('./routes/account-settings');

// ================= ROUTING ==============
app.use('/', indexRouter);
app.use('/index.html', indexRouter);
app.use('/product.html', productRouter);
app.use('/product-list.html', productListRouter);
app.use('/login.html', loginRouter);
app.use('/logout.html', logoutRouter);
app.use('/checkout.html', checkoutRouter);
app.use('/cart.html', cartRouter);
app.use('/register.html', registerRouter);
app.use('/account-settings.html', accountSettingsRouter);
app.use('/admin', adminRouter);
// ================= ROUTING ==============

// ============= DEBUG DAL.js
// var dalRouter = require('./models/DAL');
// app.use('/dal.html',dalRouter);
// ============= DEBUG DAL.js
// ============= DEBUG business.js
// var businessRouter = require('./controller/business');
// app.use('/business.html',businessRouter);
// ============= DEBUG business.js

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.status == 404) {
    res.render('404', { layout: false });
  } else {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
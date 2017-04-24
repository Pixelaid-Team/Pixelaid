var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require("passport");


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
const port = process.env.PORT || 5000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   secret: process.env.SECRET,
//   name: 'i am a cookie',
//   maxage: 3600000
//   })
// )

//Passport authentication stuff
app.use(passport.initialize())
// app.use(passport.session())
require('./helpers/passport')(passport)

app.use('/', index);
app.use('/users', users);

app.get('/canvas', (req, res) => {
  res.render('canvas')
})
app.get('/questions', (req, res) => {
  res.render('questions')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
<<<<<<< HEAD
app.listen(5000,console.log('listening on 5000'))
=======
app.listen(port, console.log('listening on ' + port))
>>>>>>> 0ddc22a988ff03012d3c5b90083a6ffd25af1b36

module.exports = app;

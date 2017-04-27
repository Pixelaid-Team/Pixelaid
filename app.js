var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var query = require('./db/query')
var session = require('express-session');
var passport = require("passport");
var flash = require('connect-flash')
var bcrypt = require('bcrypt')
const pg = require('./db/knex')


require('dotenv').config()

require('./helpers/passport')

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth')
const signup = require('./routes/signup')

var app = express();
const port = process.env.PORT || 5001

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

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.get('/', (req, res) => {
  res.render('index')
  // res.send({
  //   session: req.session,
  //   user: req.user,
  //   authenticated: req.isAuthenticated()
  // })
})

app.get('/login', (req, res) => {
  res.render('index', {error: 'Incorrect username or password'})
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/canvas',
    failureRedirect: '/login'
  })
);

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/')
  })
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

const saltRounds = 10

// app.get('/signuperror', (req, res) => {
//   res.render('signup', {error: "Username already exists"})
// })

app.post('/signup', (req, res) => {
  // if (pg('users').select('username').where('username', req.body.username)) {
  //   res.redirect('/signuperror')
  // }
    bcrypt.genSalt(saltRounds)
    .then((salt) => {
    console.log(salt);
    bcrypt.hash(req.body.password, salt)
    .then((hash) => {
        return pg('users').insert({
        username: req.body.username,
        password: hash,
        name: req.body.name,
        pixel_count: 31
        })
      })
    })
  .then(() => {
    res.redirect('/')
  })
})

var currentUser = 'hey'

app.get('/canvas', (req, res) => {
  //console.log(req.user);
  currentUser = req.user
  query.getCanvas()
  .then(data => {
    res.render('canvas', {data, currentUser})
  })
})
//this is to pass the canvas db to canvas.js
app.get('/data', (req, res)=>{
  query.getCanvas()
  .then(data => {
    res.json(data)
  })
})
//update the canvas DB
app.post('/updateCanvas', (req, res) =>{
  query.updateCanvas(req.body)
  .then(() => {
    //res.redirect('canvas')
    query.subtractPixels(req.body, req.user.id, req.user.pixel_count)
    .then(() =>{
      res.redirect('/canvas')
    })
  })
})


//subtract from the user's pixel count
// app.post('/subtractPixels', (req, res) => {
//   query.subtractPixels(req.body, req.user.id, req.user.pixel_count)
//   .then(() => {
//     res.redirect('/updateCanvas')
//   })
// })

app.get('/questions', (req, res) => {
  query.getAll().then(data => {
    res.render('questions', {data})
  })
})

app.post('/add-questions', (req, res) => {
  console.log(req.body);
  query.add(req.body).then(() =>{
    res.redirect('/questions')
  }).catch(function(error){
    console.log('this is error:', error);
  })
})

app.get("/delete/:id", (req, res)=> {
  console.log("deleted post");
  query.deleteQuestion(req.params.id)
  .then(()=>{
    res.redirect('/questions')
  })
})


app.get("/answer/:id", (req, res)=>{
 query.getAnswer(req.params.id)
  .then(data=>{
    // console.log(data);
    res.render("answer", {data, title: data[0].title, body: data[0].body})
  })
})

app.get('/answerpixel/:id', (req, res) => {
  let answerId = req.params.id
  query.addPixel(req.user)
  .then(data => {
    res.redirect('/answer/' + answerId)
  })
})

app.post("/addAnswer/:id", (req, res)=>{
  req.body.question_id = req.params.id
  let answerId = req.params.id
  req.body['votes'] = 0
  query.addAnswer(req.body, req.user.id)
  .then(data =>{
    res.redirect("/answerpixel/" + answerId)
  })
})

app.post('/endorse/:id', (req, res) => {
  console.log("this is endorsed");
  let answerId = req.params.id
  query.endorse(req.body)
  .then(()=>{
    res.redirect('/answer/' + answerId)
  })
})


app.get("/kudos", (req, res)=>{
 query.getKudos(req.params.id)
  .then(data=>{
    console.log(data);
    res.render("kudos", {data})
  })
})

app.post('/giveKudo', (req, res) => {
  console.log(req.body);
  query.giveKudo(req.body)
  .then(data => {
    res.redirect('/kudos', {data})
  }).catch(function(error){
    console.log('this is error:', error);
  })
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


app.listen(port, console.log('listening on ' + port))

module.exports = app;

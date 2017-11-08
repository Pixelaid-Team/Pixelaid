const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const query = require('./db/query')
const session = require('express-session');
const passport = require("passport");
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const pg = require('./db/knex');

require('dotenv').config();
require('./helpers/passport');

const index = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const signup = require('./routes/signup');

const app = express();
const port = process.env.PORT || 5001;
const saltRounds = 10

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

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

app.get('/signuperror', (req, res) => {
  res.render('signup', {error: "USERNAME/EMAIL ALREADY EXISTS"})
})

app.post('/signup', (req, res) => {
  bcrypt.genSalt(saltRounds)
  .then((salt) => {
    bcrypt.hash(req.body.password, salt)
    .then((hash) => {
      return pg('users').insert({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        name: req.body.name,
        pixel_count: 31
      })
    })
    .catch(err => {
      res.redirect('/signuperror')
    })
    .then(() => {
      res.redirect('/')
    })
  })
})

var currentUser = 'Guest'

app.get('/canvas', (req, res) => {
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
    query.subtractPixels(req.body, req.user.id, req.user.pixel_count)
    .then(() =>{
      res.redirect('/canvas')
    })
  })
})


app.get('/questions', (req, res) => {
  query.getAll().then(data => {
    res.render('questions', {data})
  })
})

app.post('/add-questions', (req, res) => {

  query.add(req.body).then(() =>{
    res.redirect('/questions')
  }).catch((error) => {
    res.send(error)
  })
})

app.get("/delete/:id", (req, res)=> {
  query.deleteQuestion(req.params.id)
  .then(() => {
    res.redirect('/questions')
  })
})


app.get("/answer/:id", (req, res)=>{
 query.getAnswers(req.params.id)
  .then(data => {
    res.render("answer", {data, title: data[0].title, body: data[0].body})
  })
})

app.get('/answerpixel/:id', (req, res) => {
  let answerId = req.params.id
  let username = req.user
  query.addPixel(req.user)
  .then(data => {
    res.redirect('/answer/' + answerId )
  })
})

app.post("/addAnswer/:id", (req, res)=>{
  req.body.question_id = req.params.id
  let answerId = req.params.id
  req.body['votes'] = 0
  query.addAnswer(req.body, req.user)
  .then(() =>{
    res.redirect("/answerpixel/" + answerId)
  })
})

app.get('/answererror', (req, res) => {
  res.render('answer', {error: "You can't endorse your own answer"})
})

app.post('/endorse/:id', (req, res) => {
  let answerId = req.params.id
  let user = req.user
  let body = req.body

  query.endorse(req.body)
  .then(obj => {
    query.joinEndorse(body)
    .then(join => {
      query.endorsePixel(join, user, body)
      .then(data => {
        res.redirect('/answer/' + answerId)
      })
    })
  })
})

//renders the kudos page, with updated kudos
app.get("/kudos", (req, res)=>{
 query.getKudos(req.body)
 .then(data=>{
    data.name = currentUser.name;
    query.getUsers(req.body)
    .then(user=>{

      res.render("kudos", {user, data})
    })
  })
})

var kudo = "name"
app.get('/kudoPoints', (req, res) => {
  query.kudoPoints(kudo)
  .then(data => {
    res.redirect('/kudos' )
  })
})

app.post('/giveKudo', (req, res) => {
  kudo = req.body.to
  query.giveKudo(req.body, req.user)
  .then(data => {
    res.redirect('/kudoPoints')
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
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, console.log('listening on ' + port))

module.exports = app

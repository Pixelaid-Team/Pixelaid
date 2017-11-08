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

const saltRounds = 10

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
  .then(() => {
    res.redirect('/questions')
  })
})


app.get("/answer/:id", (req, res)=>{
 query.getAnswers(req.params.id)
  .then(data => {
    // console.log(data)
    console.log("hello world");
    console.log(data);
    res.render("answer", {data, title: data[0].title, body: data[0].body})
  })
})

app.get('/answerpixel/:id', (req, res) => {
  let answerId = req.params.id
  let username = req.user
  // console.log(username);
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

// app.get('/endorsePixel/:id', (req, res) => {
//   let answerId = req.params.id
//   let user = req.user
//   console.log("this is endorsed");
//   console.log(answerId);
//   query.joinEndorse(answerId)
//   .then(join=>{
//     console.log(join);
//     query.endorsePixel(join, user)
//     .catch(() => {
//       res.redirect('/answererror')
//     })
//     .then(data => {
//       res.redirect('/answer/' + answerId)
//     })
//   })
// })

// app.post('/endorse/:id', (req, res) => {
//   // console.log("this is endorsed");
//   let answerId = req.params.id
//   console.log(req.body);
//   query.endorse(req.body)
//   .then(()=>{
//     res.redirect('/endorsePixel/' + answerId)
//   })
// })

app.post('/endorse/:id', (req, res) => {
  let answerId = req.params.id
  let user = req.user
  let body = req.body
  console.log("this is endorsed");
  console.log(answerId);
  query.endorse(req.body)
    .then(obj=>{
      query.joinEndorse(body)
      .then(join=>{
        console.log(join);
        query.endorsePixel(join, user, body)
        // .catch(err => {
        //   res.redirect('/answererror')
        // })
          .then(data => {
            res.redirect('/answer/' + answerId)
          })
      })
    })
})



//renders the kudos page, with updated kudos

app.get("/kudos", (req, res)=>{
  console.log(req.user.name);
 query.getKudos(req.body)
 .then(data=>{
   data.name = currentUser.name;
  //  console.log(data);
  query.getUsers(req.body)
  .then(user=>{
    console.log(user);
    res.render("kudos", {user, data})
  })
  })
})

var kudo = "name"

app.get('/kudoPoints', (req, res) => {
  console.log(kudo)
  query.kudoPoints(kudo)
  .then(data => {
    res.redirect('/kudos' )
  })
})

app.post('/giveKudo', (req, res) => {
  kudo = req.body.to
  console.log(kudo);
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, console.log('listening on ' + port))

module.exports = app

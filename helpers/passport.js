const pg = require("../db/knex");
const passport = require("passport");
const localStrategy = require('passport-local').Strategy

passport.use(new localStrategy(authenticate))

function authenticate (username, password, done) {
  pg('users')
  .where('username', username)
  .first()
  .then((user) => {
    if (!user || user.password !== password) {
      return done(null, false, {message: "Invalid username or password"})
    }

    done(null, user)
  }, done)
}

passport.serializeUser(function(id, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  pg('users')
  .where('id', id)
  .first()
  .then((user) => {
    done(null, user)
  }, done)
})



// module.exports = (passport) => {
//   passport.use(new passportLocal.Strategy({
//     usernameField: 'user[username]',
//     passwordField: 'user[password]',
//     passReqToCallback : true
//   }, (req,username, password, done) => {
//       knex('users')
//       .where({ username })
//       .first()
//       .then((user) => {
//         if (!user) {
//           return done(null, false, req.flash('loginMessage','Incorrect username.'));
//         }
//         if (!passwordHelpers.comparePass(password, user.password)) {
//           return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
//         }
//         else {
//           return done(null, user);
//         }
//       }).catch((err) => {
//         return done(err)
//       })
//     }
//   ));
//
//   passport.serializeUser((user, done) =>{
//     done(null, user.id);
//   });
//
//   passport.deserializeUser((id, done) =>{
//     knex('users').where({id}).first()
//       .then((user) =>{
//         done(null, user);
//       }).catch((err) =>{
//         done(err,null);
//       });
//   });
// }

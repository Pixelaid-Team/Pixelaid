const pg = require("../db/knex");
const passport = require("passport");
const localStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const bcrypt = require('bcrypt')

passport.use(new localStrategy({passReqToCallback: true}, authenticate))

function authenticate (req, username, password, done) {
  pg('users')
  .where('username', username)
  .first()
  .then((user) => {
    if (!user) {
      return done(null, false)
    }
    bcrypt.compare(password, user.password).then((res) => {
      console.log(user.password);
      if (res) {
        done(null, user)
      } else {
        return done(null, false)
      }
    })
  }, done)
}

passport.serializeUser(function(user, done) {
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

module.exports = passport



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

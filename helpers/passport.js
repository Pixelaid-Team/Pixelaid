const passportLocal = require("passport-local");
const knex = require("../db/knex");
const passwordHelpers = require("./passwordHelpers")

module.exports = (passport) => {
  passport.use(new passportLocal.Strategy({
    usernameField: 'user[username]',
    passwordField: 'user[password]',
    passReqToCallback : true
  }, (req,username, password, done) => {
      knex('users')
      .where({ username })
      .first()
      .then((user) => {
        if (!user) {
          return done(null, false, req.flash('loginMessage','Incorrect username.'));
        }
        if (!passwordHelpers.comparePass(password, user.password)) {
          return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
        }
        else {
          return done(null, user);
        }
      }).catch((err) => {
        return done(err)
      })
    }
  ));

  passport.serializeUser((user, done) =>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>{
    knex('users').where({id}).first()
      .then((user) =>{
        done(null, user);
      }).catch((err) =>{
        done(err,null);
      });
  });
}

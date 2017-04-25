const authMiddleware = {
  checkAuthentication(req, res, next) {
    // can use req.isAuthenticated() for this too..
    if (!req.user) {
      // to stop chrome autocomplete
        // http://superuser.com/questions/394562/can-i-turn-off-google-chromes-new-prerendering
      req.session.flash = {}
      req.flash('loginMessage', "Please log in first")
      return res.redirect('/login');
    }
    else {
     return next();
    }
  },
  currentUser(req, res, next) {
    // if the user is authenticated (passport method returns true when serialized)
    if (req.isAuthenticated()) {
      // this is available in the view for all requests, deserializing FTW
      res.locals.currentUser = req.user;
      return next();
    }
    else {
      return next();
    }
  },
  preventLoginSignup(req, res, next) {
    if (req.user) {
      return res.redirect(`/users`);
    }
    else {
     return next();
    }
  },
  ensureCorrectUser(req,res,next){
    if(+req.params.id !== req.user.id){
      return res.redirect(`/users`)
    }
    else {
      return next();
    }
  },
  ensureCorrectUserForPost(req,res,next){
    if(+req.params.user_id !== req.user.id){
      return res.redirect(`/users/${req.user.id}/posts`)
    }
    else {
      return next();
    }
  }
};
module.exports = authMiddleware;

const authMiddleware = {
  checkAuthentication(req, res, next) {
    if(!req.user) {
      req.session.flash = {}
      req.flash('loginMessage', "Please log in first")
      return res.redirect('/login');
    } else {
     return next();
    }
  },
  currentUser(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
      return next();
    } else {
      return next();
    }
  },
  preventLoginSignup(req, res, next) {
    if (req.user) {
      return res.redirect(`/users`);
    } else {
     return next();
    }
  },
  ensureCorrectUser(req,res,next) {
    if(+req.params.id !== req.user.id){
      return res.redirect(`/users`)
    } else {
      return next();
    }
  },
  ensureCorrectUserForPost(req,res,next) {
    if(+req.params.user_id !== req.user.id){
      return res.redirect(`/users/${req.user.id}/posts`)
    } else {
      return next();
    }
  }
};
module.exports = authMiddleware;

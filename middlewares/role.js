// middlewares/role.js

module.exports = function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Vous devez être connecté.');
      return res.redirect('/login');
    }

    if (!roles.includes(req.session.user.role)) {
      req.flash('error_msg', 'Accès refusé. Rôle requis : ' + roles.join(' ou '));
      return res.redirect('/dashboard');
    }

    next(); // OK
  };
  
};

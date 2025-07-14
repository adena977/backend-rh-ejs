// Vérifie si l'utilisateur est connecté
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('error_msg', 'Vous devez vous connecter.');
    res.redirect('/login');
  }
};

// Autorise uniquement les administrateurs
exports.onlyAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Accès réservé aux administrateurs.');
  return res.redirect('/login');
};

// Autorise uniquement les employés
exports.onlyEmploye = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'employe') {
    return next();
  }
  req.flash('error', 'Accès réservé aux employés.');
  return res.redirect('/login');
};

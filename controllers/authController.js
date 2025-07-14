const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Affiche le formulaire de connexion
exports.showLogin = (req, res) => {
  res.render('login', {
    layout: false,
    error_msg: req.flash('error_msg'),
    success_msg: req.flash('success_msg'),
    page: 'employes'
  });
};

// Traite la connexion
// Traite la connexion
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT u.id, u.username, u.mot_de_passe, u.role, u.employe_id,
             e.code_employe, e.nom, e.prenom, e.photo
      FROM utilisateurs u
      LEFT JOIN employes e ON u.employe_id = e.id
      WHERE u.username = ?
    `, [username]);

    if (rows.length === 0) {
      req.flash('error_msg', 'Utilisateur introuvable');
      return res.redirect('/login');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.mot_de_passe);

    if (!match) {
      req.flash('error_msg', 'Mot de passe incorrect');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      employe_id: user.employe_id,
      code_employe: user.code_employe,
      nom: user.nom,
      prenom: user.prenom,
      photo: user.photo
    };

    req.flash('success_msg', 'Connexion réussie');

    // 🔁 Redirection dynamique
    if (user.role === 'admin') {
      res.redirect('/dashboard');
    } else if (user.role === 'employe') {
      res.redirect('/dashboard/employe');
    } else {
      req.flash('error_msg', 'Rôle non reconnu');
      res.redirect('/login');
    }

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erreur serveur');
    res.redirect('/login');
  }
};



// Déconnexion
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

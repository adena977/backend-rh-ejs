// controllers/utilisateurController.js
const Utilisateur = require('../models/utilisateurModel');
const Employe     = require('../models/employeModel');   // pour la liste déroulante employé
const Service     = require('../models/serviceModel');   // si besoin ailleurs

/* ─ LISTE ───────────────────────────── */
exports.index = async (req, res, next) => {
  try {
    const users = await Utilisateur.getAll();
    res.render('utilisateurs/index', {
      title: 'Utilisateurs',
      page : 'utilisateurs',
      users,
      success_msg: req.flash('success_msg'),
      error_msg  : req.flash('error_msg')
    });
  } catch (err) { next(err); }
};

/* ─ FORM AJOUT ───────────────────────── */
exports.showAddForm = async (req, res, next) => {
  try {
    const employes = await Employe.getAll();   // pour associer un employé
    res.render('utilisateurs/add', {
      title: 'Ajouter un utilisateur',
      page : 'utilisateurs',
      employes,
      error_msg: req.flash('error_msg')
    });
  } catch (err) { next(err); }
};

/* ─ ENREGISTREMENT ───────────────────── */
exports.store = async (req, res, next) => {
  try {
    await Utilisateur.create(req.body);
    req.flash('success_msg', 'Utilisateur créé');
    res.redirect('/utilisateurs');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      req.flash('error_msg', 'Nom d‘utilisateur déjà pris');
      return res.redirect('/utilisateurs/ajouter');
    }
    next(err);
  }
};

/* ─ FORM MODIF ───────────────────────── */
exports.showEditForm = async (req, res, next) => {
  try {
    const user     = await Utilisateur.getById(req.params.id);
    const employes = await Employe.getAll();
    if (!user) {
      req.flash('error_msg', 'Utilisateur introuvable');
      return res.redirect('/utilisateurs');
    }
    res.render('utilisateurs/edit', {
      title: 'Modifier utilisateur',
      page : 'utilisateurs',
      utilisateur: user,
      user,
      employes
    });
  } catch (err) { next(err); }
};

/* ─ MISE À JOUR ──────────────────────── */
exports.update = async (req, res, next) => {
  try {
    await Utilisateur.update(req.params.id, req.body);
    req.flash('success_msg', 'Utilisateur modifié');
    res.redirect('/utilisateurs');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      req.flash('error_msg', 'Nom d‘utilisateur déjà pris');
      return res.redirect(`/utilisateurs/modifier/${req.params.id}`);
    }
    next(err);
  }
};

/* ─ SUPPRESSION ─────────────────────── */
exports.destroy = async (req, res, next) => {
  try {
    await Utilisateur.delete(req.params.id);
    req.flash('success_msg', 'Utilisateur supprimé');
    res.redirect('/utilisateurs');
  } catch (err) { next(err); }
};

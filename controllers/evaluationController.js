/* controllers/evaluationController.js */
const Evaluation = require('../models/evaluationModel');
const Employe    = require('../models/employeModel');
const Utilisateur = require('../models/utilisateurModel');

/* ────────────────────────────────────────────── */
/* 1. Liste globale – admin / manager            */
/* ────────────────────────────────────────────── */
exports.index = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.getAll();
    res.render('evaluations/index', {
      title: 'Évaluations',
      page : 'evaluations',
      evaluations,
      success_msg: req.flash('success_msg'),
      error_msg  : req.flash('error_msg')
    });
  } catch (err) { next(err); }
};

/* ────────────────────────────────────────────── */
/* 2. Formulaire d’ajout                         */
/* ────────────────────────────────────────────── */

exports.showAddForm = async (req, res, next) => {
  try {
    const employes = await Employe.getAll();
    const evaluateurs = await Utilisateur.getEvaluateurs(); // 🔥

    res.render('evaluations/add', {
      title: 'Nouvelle évaluation',
      page: 'evaluations',
      employes,
      evaluateurs // ✅ maintenant disponible dans EJS
    });
  } catch (err) {
    next(err);
  }
};


/* ────────────────────────────────────────────── */
/* 3. Création                                   */
/* ────────────────────────────────────────────── */
exports.store = async (req, res, next) => {
  try {
    const data = {
      employe_id   : req.body.employe_id,
      date         : req.body.date,
      note         : req.body.note,
      commentaire  : req.body.commentaire,
      evaluateur_id: req.session.user.id   // évaluateur = user connecté
    };

    await Evaluation.create(data);
    req.flash('success_msg', 'Évaluation enregistrée');
    res.redirect('/evaluations');
  } catch (err) { next(err); }
};

/* ────────────────────────────────────────────── */
/* 4. Formulaire de modification                 */
/* ────────────────────────────────────────────── */
exports.showEditForm = async (req, res, next) => {
  try {
    const id        = req.params.id;
    const evaluation= await Evaluation.getById(id);
    if (!evaluation) {
      req.flash('error_msg', 'Évaluation introuvable');
      return res.redirect('/evaluations');
    }
    const employes  = await Employe.getAll();
    res.render('evaluations/edit', {
      title: 'Modifier une évaluation',
      page : 'evaluations',
      evaluation,
      employes
    });
  } catch (err) { next(err); }
};

/* ────────────────────────────────────────────── */
/* 5. Mise à jour                                */
/* ────────────────────────────────────────────── */
exports.update = async (req, res, next) => {
  try {
    const id   = req.params.id;
    const data = {
      employe_id  : req.body.employe_id,
      date        : req.body.date,
      note        : req.body.note,
      commentaire : req.body.commentaire,
      evaluateur_id: req.session.user.id     // on garde l’auteur de la MAJ
    };

    await Evaluation.update(id, data);
    req.flash('success_msg', 'Évaluation mise à jour');
    res.redirect('/evaluations');
  } catch (err) { next(err); }
};

/* ────────────────────────────────────────────── */
/* 6. Suppression                                */
/* ────────────────────────────────────────────── */
exports.destroy = async (req, res, next) => {
  try {
    await Evaluation.delete(req.params.id);
    req.flash('success_msg', 'Évaluation supprimée');
    res.redirect('/evaluations');
  } catch (err) { next(err); }
};

/* ────────────────────────────────────────────── */
/* 7. Mes évaluations (côté employé)             */
/* ────────────────────────────────────────────── */
exports.myEvaluations = async (req, res, next) => {
  try {
    const employeId = req.session.user.employe_id;
    const evaluations = await Evaluation.getByEmployeId(employeId);

    res.render('evaluations/mes_evaluations', {
      title: 'Mes évaluations',
      page : 'evaluations',
      evaluations
    });
  } catch (err) { next(err); }
};

const fichePaieModel = require('../models/fichePaieModel');
const employeModel = require('../models/employeModel');
const { generateFichePaiePDF } = require('../utils/fichePaiePDF');

exports.index = async (req, res, next) => {
  try {
    const fiches = await fichePaieModel.getAll();
    res.render('fiche_paie/index', {
      title: 'Fiches de paie',
      page: 'fiche_paie',
      fiches
    });
  } catch (err) {
    next(err);
  }
};

exports.showAddForm = async (req, res, next) => {
  try {
    const employes = await employeModel.getAll();
    res.render('fiche_paie/add', {
      title: 'Ajouter une fiche de paie',
      page: 'fiche_paie',
      employes
    });
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    const data = req.body;

    // Récupérer l'employé et son salaire
    const employe = await employeModel.getById1(data.employe_id);
    if (!employe) {
      req.flash('error_msg', 'Employé introuvable');
      return res.redirect('/fiche_paie/ajouter');
    }
console.log('Salaire base de l\'employé:', employe.salaire_base);

    const salaire_brut = parseFloat(employe.salaire_base) || 0;
    const heures_sup   = parseFloat(data.heures_sup) || 0;
    const prime        = parseFloat(data.prime) || 0;
    const retenue      = parseFloat(data.retenue) || 0;

    const salaire_net = salaire_brut + (heures_sup * 15) + prime - retenue;

    const ficheData = {
      employe_id: data.employe_id,
      mois: data.mois,
      annee: data.annee,
      salaire_brut,
      heures_sup,
      prime,
      retenue,
      salaire_net: salaire_net.toFixed(2)
    };

    const result = await fichePaieModel.create(ficheData);

    const fiche = await fichePaieModel.getById(result.insertId);
    const employeInfos = await employeModel.getById1(fiche.employe_id);

    const pdf_url = await generateFichePaiePDF(fiche, employeInfos);
    await fichePaieModel.updatePdfUrl(fiche.id, pdf_url);

    req.flash('success_msg', 'Fiche de paie créée avec succès');
    res.redirect('/fiche_paie');

  } catch (err) {
    next(err);
  }
};

exports.showEditForm = async (req, res, next) => {
  try {
    const fiche = await fichePaieModel.getById(req.params.id);
    const employes = await employeModel.getAll();
    res.render('fiche_paie/edit', {
      title: 'Modifier fiche de paie',
      page: 'fiche_paie',
      fiche,
      employes
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = req.body;

    const salaire_brut = parseFloat(data.salaire_brut || 0);
    const heures_sup   = parseFloat(data.heures_sup || 0);
    const prime        = parseFloat(data.prime || 0);
    const retenue      = parseFloat(data.retenue || 0);

    const salaire_net = salaire_brut + (heures_sup * 15) + prime - retenue;

    const ficheData = {
      employe_id: data.employe_id,
      mois: data.mois,
      annee: data.annee,
      salaire_brut,
      heures_sup,
      prime,
      retenue,
      salaire_net: salaire_net.toFixed(2)
    };

    await fichePaieModel.update(req.params.id, ficheData);
    req.flash('success_msg', 'Fiche de paie modifiée avec succès');
    res.redirect('/fiche_paie');
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await fichePaieModel.delete(req.params.id);
    req.flash('success_msg', 'Fiche de paie supprimée avec succès');
    res.redirect('/fiche_paie');
  } catch (err) {
    next(err);
  }
};


exports.mesFiches = async (req, res, next) => {
  try {
    const employeId = req.session.user.employe_id; // Assure-toi que ce champ existe en session
    const fiches = await fichePaieModel.getByEmployeId(employeId);

    res.render('fiche_paie/mes_fiches', {
      title: 'Mes fiches de paie',
      page: 'fiche_paie',
      fiches
    });
  } catch (err) {
    next(err);
  }
};

const Employe = require('../models/employeModel');
const Service = require('../models/serviceModel');
const { logAction } = require('../utils/logger'); // 👈 Ajout du logger
const { notifyNewEmployee } = require('../utils/notifications');
// Afficher tous les employés
exports.index = async (req, res, next) => {
  try {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const [employes, totalCount] = await Promise.all([
      Employe.getPaginatedList(search, limit, offset),
      Employe.count(search)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.render('employes/index', {
      title: 'Liste des employés',
      page: 'employes',
      employes,
      search,
      currentPage: page,
      totalPages,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    next(err);
  }
};

// Afficher le formulaire d'ajout
exports.showAddForm = async (req, res, next) => {
  try {
    const services = await Service.getAll();

    res.render('employes/add', {
      title: 'Ajouter un employé',
      page: 'employes',
      services,
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    next(err);
  }
};

// Ajouter un employé avec gestion des fichiers uploadés
exports.store = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.files?.photo?.[0]) data.photo = req.files.photo[0].filename;
    if (req.files?.cv?.[0]) data.cv = req.files.cv[0].filename;
    if (req.files?.contrat?.[0]) data.contrat = req.files.contrat[0].filename;

    // Créer l'employé dans la base et récupérer son id
    const id = await Employe.create(data);

    // Log l'action (si tu veux garder ça)
    await logAction(req, `Ajout de l'employé ${data.nom} ${data.prenom}`, 'employes', id);

    // ** Envoi des notifications aux admins et managers **
    await notifyNewEmployee(data.nom, data.prenom);

    req.flash('success_msg', 'Employé ajouté avec succès');
    res.redirect('/employes');
  } catch (err) {
    next(err);
  }
};


// Afficher le formulaire de modification
exports.showEditForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const services = await Service.getAll();
    const employe = await Employe.getById(id);

    if (!employe) {
      req.flash('error_msg', 'Employé introuvable');
      return res.redirect('/employes');
    }

    res.render('employes/edit', {
      title: 'Modifier un employé',
      page: 'employes',
      services,
      employe
    });
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un employé
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employe = await Employe.getById(id);

    if (!employe) {
      req.flash('error_msg', 'Employé introuvable');
      return res.redirect('/employes');
    }

    const {
      nom, prenom, email, telephone, poste,
      service_id, date_embauche, salaire_base, statut
    } = req.body;

    let photo = employe.photo;
    if (req.files?.photo && req.files.photo[0]) photo = req.files.photo[0].filename;

    let cv = employe.cv;
    if (req.files?.cv && req.files.cv[0]) cv = req.files.cv[0].filename;

    let contrat = employe.contrat;
    if (req.files?.contrat && req.files.contrat[0]) contrat = req.files.contrat[0].filename;

    const updatedData = {
      nom, prenom, email, telephone, poste,
      service_id, date_embauche, salaire_base, statut,
      photo, cv, contrat
    };

    await Employe.update(id, updatedData);
    await logAction(req, `Modification de l'employé ${nom} ${prenom}`, 'employes', id);

    req.flash('success_msg', 'Employé modifié avec succès');
    res.redirect('/employes');
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    next(err);
  }
};

// Supprimer un employé
exports.destroy = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Employe.delete(id);
    await logAction(req, `Suppression de l'employé ID ${id}`, 'employes', id);
    req.flash('success_msg', 'Employé supprimé');
    res.redirect('/employes');
  } catch (err) {
    next(err);
  }
};

// Afficher les détails d'un employé
exports.showDetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employe = await Employe.getDetailsById(id);

    if (!employe) {
      req.flash('error_msg', 'Employé introuvable.');
      return res.redirect('/employes');
    }

    res.render('employes/detaille', {
      title: 'Détails de l\'employé',
      page: 'employes',
      employe
    });
  } catch (err) {
    next(err);
  }
};

// Affiche les infos de l'employé connecté (profil)
exports.showOwnProfile = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const employe = await Employe.getByUserId(userId);

    if (!employe) {
      req.flash('error_msg', 'Profil introuvable.');
      return res.redirect('/');
    }

    res.render('employes/profil', {
      title: 'Mon profil',
      page: 'profil',
      employe,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    next(err);
  }
};

// Met à jour le profil de l'employé connecté
exports.updateOwnProfile = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const employe = await Employe.getByUserId(userId);

    if (!employe) {
      req.flash('error_msg', 'Profil introuvable.');
      return res.redirect('/employes/profil');
    }

    const updateData = {
      nom: employe.nom,
      prenom: employe.prenom,
      email: employe.email,
      telephone: req.body.telephone || employe.telephone,
      poste: employe.poste,
      service_id: employe.service_id,
      date_embauche: employe.date_embauche,
      salaire_base: employe.salaire_base,
      photo: employe.photo,
      cv: employe.cv,
      contrat: employe.contrat,
      statut: employe.statut
    };

    if (req.files.photo && req.files.photo[0]) {
      updateData.photo = req.files.photo[0].filename;
    }

    await Employe.update(employe.id, updateData);
    await logAction(req, `Mise à jour du profil de l'employé connecté`, 'employes', employe.id);

    req.flash('success_msg', 'Profil mis à jour avec succès.');
    res.redirect('/employes/profil');
  } catch (err) {
    next(err);
  }
};

const { Parser } = require('json2csv');

exports.exportCSV = async (req, res, next) => {
  try {
    const employes = await Employe.getAll();
    const fields = ['id', 'nom', 'prenom', 'email', 'telephone', 'poste', 'service', 'date_embauche', 'salaire_base'];
    const parser = new Parser({ fields });
    const csv = parser.parse(employes);

    res.header('Content-Type', 'text/csv');
    res.attachment('employes.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

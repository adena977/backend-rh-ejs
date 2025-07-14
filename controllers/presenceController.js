// controllers/presenceController.js
const Presence = require('../models/presenceModel');
const Employe  = require('../models/employeModel');
const moment = require('moment-timezone');

exports.index = async (req, res, next) => {
  try {
    const presences = await Presence.getAll();
    res.render('presences/index', {
      title: 'Présences',
      page : 'presences',
      presences,
      success_msg: req.flash('success_msg'),
      error_msg  : req.flash('error_msg')
    });
  }catch (err) {
    next(err); // Envoie l'erreur au middleware global
  }
};

exports.showAddForm = async (req, res, next) => {
  try {
    const employes = await Employe.getAll();   // pour le sélect
    res.render('presences/add', {
      title: 'Ajouter une présence',
      page : 'presences',
      employes
    });
  } catch (err) { next(err); }
};

exports.store = async (req, res, next) => {
  try {
    await Presence.create(req.body);
    req.flash('success_msg', 'Présence ajoutée');
    res.redirect('/presences');
  } catch (err) {
    next(err); // Envoie l'erreur au middleware global
  }
};

exports.showEditForm = async (req, res, next) => {
  try {
    const id       = req.params.id;
    const presence = await Presence.getById(id);
    if (!presence) {
      req.flash('error_msg', 'Enregistrement introuvable');
      return res.redirect('/presences');
    }
    const employes = await Employe.getAll();
    res.render('presences/edit', {
      title: 'Modifier présence',
      page : 'presences',
      presence,
      employes
    });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Presence.update(id, req.body);
    req.flash('success_msg', 'Présence modifiée');
    res.redirect('/presences');
  } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Presence.delete(id);
    req.flash('success_msg', 'Présence supprimée');
    res.redirect('/presences');
  } catch (err) { next(err); }
};


// Affiche le formulaire de scan
exports.showScanForm = (req, res) => {
  res.render('presences/scan', {
    title: 'Scan de présence',
    page: 'presences',

    message: req.flash('message')
  });
};



// Traite le scan
exports.processScan = async (req, res, next) => {
  const { code_employe } = req.body;

  // 1. validation du code
  if (!/^[A-Z0-9]{4,}$/i.test(code_employe)) {
    req.flash('message', 'Code employé invalide.');
    return res.redirect('/presences/scan');
  }

  const now = moment().tz('Africa/Djibouti');
  const today = now.format('YYYY-MM-DD');

  try {
    // 2. employé actif ?
    const employe = await Employe.findByCode(code_employe);
    if (!employe || employe.statut !== 'actif') {
      req.flash('message', 'Employé non trouvé ou inactif.');
      return res.redirect('/presences/scan');
    }

    // 3. présence du jour
    const presence = await Presence.findByDateAndEmploye(today, employe.id);

    if (!presence) {
      /** ▸ PREMIER SCAN */
      await Presence.create({
        employe_id: employe.id,
        date: today,
        heure_arrivee: now.format('HH:mm:ss'),
        statut: now.isAfter(moment(today + ' 08:15')) ? 'en retard' : 'présent'
      });
      req.flash('message',
        `Bienvenue ${employe.nom} (${now.format('HH:mm')})`
      );
    } else if (!presence.heure_depart) {
      /** ▸ SECOND SCAN  : départ */
      // évite double‑scan à 1 min
      if (moment(now).diff(moment(presence.heure_arrivee, 'HH:mm:ss'), 'seconds') < 60) {
        req.flash('message', 'Scan déjà enregistré, patientez 1 minute.');
      } else {
        await Presence.updateDeparture(presence.id, now.format('HH:mm:ss'));
        req.flash('message',
          `Au revoir ${employe.nom} (${now.format('HH:mm')})`
        );
      }
    } else {
      req.flash('message', 'Présence déjà complète pour aujourd’hui.');
    }
    res.redirect('/presences/scan');
  } catch (err) {
    next(err);
  }
};


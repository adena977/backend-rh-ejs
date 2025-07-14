// 📁 controllers/formationController.js
const Formation = require('../models/formationModel');
const Employe = require('../models/employeModel');

exports.index = async (req, res, next) => {
    try {
        const formations = await Formation.getAll();
        res.render('formations/index', {
            title: 'Formations',
            page: 'formations',
            formations
        });
    } catch (err) { next(err); }
};

exports.showAddForm = (req, res) => {
    res.render('formations/add', {
        title: 'Ajouter une formation',
        page: 'formations'
    });
};

exports.store = async (req, res, next) => {
    try {
        await Formation.create(req.body);
        req.flash('success_msg', 'Formation ajoutée');
        res.redirect('/formations');
    } catch (err) { next(err); }
};

exports.showEditForm = async (req, res, next) => {
    try {
        const formation = await Formation.getById(req.params.id);
        if (!formation) return res.redirect('/formations');
        res.render('formations/edit', {
            title: 'Modifier une formation',
            page: 'formations',
            formation
        });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        await Formation.update(req.params.id, req.body);
        req.flash('success_msg', 'Formation modifiée');
        res.redirect('/formations');
    } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
    try {
        await Formation.delete(req.params.id);
        req.flash('success_msg', 'Formation supprimée');
        res.redirect('/formations');
    } catch (err) { next(err); }
};

exports.showInscriptions = async (req, res, next) => {
    try {
        const formation = await Formation.getById(req.params.id);
        const employesInscrits = await Formation.getInscriptions(req.params.id);
        const employes = await Employe.getAll();
        res.render('formations/inscriptions', {
            title: 'Inscriptions à la formation',
            page: 'formations',
            formation,
            employes,
            employesInscrits
        });
    } catch (err) { next(err); }
};

exports.addInscription = async (req, res, next) => {
    try {
        const formationId = req.params.id;
        const { employe_id, statut } = req.body;
        await Formation.inscrireEmploye(formationId, employe_id, statut);
        res.redirect(`/formations/${formationId}/inscriptions`);
    } catch (err) { next(err); }
};

exports.removeInscription = async (req, res, next) => {
    try {
        await Formation.desinscrireEmploye(req.params.id, req.params.employeId);
        res.redirect(`/formations/${req.params.id}/inscriptions`);
    } catch (err) { next(err); }
};

exports.updateInscriptionStatut = async (req, res, next) => {
    try {
        const { employe_id, statut } = req.body;
        await Formation.mettreAJourStatut(req.params.id, employe_id, statut);
        res.redirect(`/formations/${req.params.id}/inscriptions`);
    } catch (err) { next(err); }
};

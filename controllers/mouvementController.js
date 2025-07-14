const Mouvement = require('../models/mouvementModel');
const Employe = require('../models/employeModel');
const { logAction } = require('../utils/logger');

// Liste des mouvements
exports.index = async (req, res, next) => {
    try {
        const mouvements = await Mouvement.getAll();
        res.render('mouvements/index', {
            title: 'Mouvements RH',
            page: 'mouvements',
            mouvements,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        next(err);
    }
};

// Afficher le formulaire d’ajout
exports.showAddForm = async (req, res, next) => {
    try {
        const employes = await Employe.getAll();
        res.render('mouvements/add', {
            title: 'Ajouter un mouvement',
            page: 'mouvements',
            employes
        });
    } catch (err) {
        next(err);
    }
};

// Ajouter un mouvement
exports.store = async (req, res, next) => {
    try {
        const id = await Mouvement.create(req.body);
        await logAction(req, 'Ajout d\'un mouvement RH', 'mouvements_rh', id);
        req.flash('success_msg', 'Mouvement ajouté avec succès');
        res.redirect('/mouvements_rh');
    } catch (err) {
        next(err);
    }
};

// Formulaire de modification
exports.showEditForm = async (req, res, next) => {
    try {
        const mouvement = await Mouvement.getById(req.params.id);
        const employes = await Employe.getAll();

        if (!mouvement) {
            req.flash('error_msg', 'Mouvement introuvable');
            return res.redirect('/mouvements_rh');
        }

        res.render('mouvements/edit', {
            title: 'Modifier le mouvement',
            page: 'mouvements',
            mouvement,
            employes
        });
    } catch (err) {
        next(err);
    }
};

// Modifier un mouvement
exports.update = async (req, res, next) => {
    try {
        await Mouvement.update(req.params.id, req.body);
        await logAction(req, 'Modification d\'un mouvement RH', 'mouvements_rh', req.params.id);
        req.flash('success_msg', 'Mouvement mis à jour');
        res.redirect('/mouvements_rh');
    } catch (err) {
        next(err);
    }
};

// Supprimer un mouvement
exports.destroy = async (req, res, next) => {
    try {
        await Mouvement.delete(req.params.id);
        await logAction(req, 'Suppression d\'un mouvement RH', 'mouvements_rh', req.params.id);
        req.flash('success_msg', 'Mouvement supprimé');
        res.redirect('/mouvements');
    } catch (err) {
        next(err);
    }
};

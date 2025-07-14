// 📁 controllers/absenceExceptionnelleController.js
const Absence = require('../models/absenceExceptionnelleModel');
const Employe = require('../models/employeModel');

exports.index = async (req, res, next) => {
    try {
        const absences = await Absence.getAll();
        res.render('absences/index', {
            title: 'Absences exceptionnelles',
            page: 'absences',
            absences
        });
    } catch (err) { next(err); }
};

exports.showAddForm = async (req, res, next) => {
    try {
        const employes = await Employe.getAll();
        res.render('absences/add', {
            title: 'Nouvelle absence exceptionnelle',
            page: 'absences',
            employes
        });
    } catch (err) { next(err); }
};

exports.store = async (req, res, next) => {
    try {
        await Absence.create(req.body);
        req.flash('success_msg', 'Absence ajoutée');
        res.redirect('/absences');
    } catch (err) { next(err); }
};

exports.showEditForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const absence = await Absence.getById(id);
        const employes = await Employe.getAll();
        if (!absence) {
            req.flash('error_msg', 'Absence introuvable');
            return res.redirect('/absences');
        }
        res.render('absences/edit', {
            title: 'Modifier une absence',
            page: 'absences',
            absence,
            employes
        });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        await Absence.update(req.params.id, req.body);
        req.flash('success_msg', 'Absence mise à jour');
        res.redirect('/absences');
    } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
    try {
        await Absence.delete(req.params.id);
        req.flash('success_msg', 'Absence supprimée');
        res.redirect('/absences');
    } catch (err) { next(err); }
};

exports.myAbsences = async (req, res, next) => {
    try {
        const employeId = req.session.user.employe_id;
        const absences = await Absence.getByEmployeId(employeId);
        res.render('absences/mes_absences', {
            title: 'Mes absences exceptionnelles',
            page: 'absences',
            absences
        });
    } catch (err) { next(err); }
};

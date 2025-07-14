// 📁 controllers/congeController.js
const Conge = require('../models/congeModel');
const Employe = require('../models/employeModel');
const db = require('../config/db');
const Notification = require('../models/notificationModel');

exports.index = async (req, res, next) => {
    try {
        const conges = await Conge.getAll();
        res.render('conges/index', {
            title: 'Liste des congés',
            page: 'conges',
            conges
        });
    } catch (err) { next(err); }
};

exports.showAddForm = async (req, res, next) => {
    try {
        const employes = await Employe.getAll();
        res.render('conges/add', {
            title: 'Nouveau congé',
            page: 'conges',
            employes
        });
    } catch (err) { next(err); }
};

exports.store = async (req, res, next) => {
    try {
        const data = req.body;

        // 👤 Ajoute l'employé_id depuis la session
        data.employe_id = req.session.user.employe_id;

        await Conge.create(data);

        // 🔔 Notifier tous les admins
        const [admins] = await db.query(`SELECT id FROM utilisateurs WHERE role = 'admin'`);
        for (const admin of admins) {
            await Notification.create({
                destinataire_id: admin.id,
                message: `Nouvelle demande de congé de l'employé ID ${data.employe_id}`
            });
        }

        req.flash('success_msg', 'Demande de congé envoyée avec succès');
        res.redirect('/conges/mes-conges');
    } catch (err) {
        next(err);
    }
};


exports.showEditForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const conge = await Conge.getById(id);
        const employes = await Employe.getAll();
        if (!conge) {
            req.flash('error_msg', 'Congé introuvable');
            return res.redirect('/conges');
        }
        res.render('conges/edit', {
            title: 'Modifier un congé',
            page: 'conges',
            conge,
            employes
        });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        await Conge.update(id, data);

        // 🧠 Récupérer l'employé concerné par le congé
        const [rows] = await db.query('SELECT employe_id FROM conges WHERE id = ?', [id]);
        const employe_id = rows[0]?.employe_id;

        // 🔍 Trouver l'utilisateur correspondant
        const [users] = await db.query('SELECT id FROM utilisateurs WHERE employe_id = ?', [employe_id]);
        const utilisateur = users[0];

        // 🔔 Créer la notification
        if (utilisateur) {
            await Notification.create(
                utilisateur.id,
                `Votre demande de congé a été ${data.statut}`
            );
        }

        req.flash('success_msg', 'Statut du congé modifié avec succès');
        res.redirect('/conges');
    } catch (err) {
        next(err);
    }
};



exports.destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Conge.delete(id);
        req.flash('success_msg', 'Congé supprimé avec succès');
        res.redirect('/conges');
    } catch (err) { next(err); }
};

exports.myLeaves = async (req, res, next) => {
    try {
        const employeId = req.session.user.employe_id;
        const conges = await Conge.getByEmployeId(employeId);
        res.render('conges/mes_conges', {
            title: 'Mes congés',
            page: 'conges',
            conges
        });
    } catch (err) { next(err); }
};
// Afficher le formulaire de demande de congé
exports.showRequestForm = (req, res) => {
    res.render('conges/demande', {
        title: 'Demande de congé',
        user: req.session.user
    });
};

// Traiter la soumission du formulaire
exports.submitRequest = async (req, res, next) => {
    try {
        const employeId = req.session.user.employe_id; // Id employé connecté

        const { date_debut, date_fin, type, motif } = req.body;

        // Valider les données ici (dates cohérentes, etc.)

        // Insérer la demande dans la base
        await db.query(
            `INSERT INTO conges (employe_id, date_debut, date_fin, type, motif, statut) VALUES (?, ?, ?, ?, ?, 'en attente')`,
            [employeId, date_debut, date_fin, type, motif]
        );

        req.flash('success_msg', 'Demande de congé envoyée avec succès');
        res.redirect('/conges/mes-conges');
    } catch (err) {
        next(err);
    }
};

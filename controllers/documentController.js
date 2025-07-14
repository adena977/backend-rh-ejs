// 📁 controllers/documentController.js
const Document = require('../models/documentRhModel');
const Employe = require('../models/employeModel');
const path = require('path');
const fs = require('fs');

exports.index = async (req, res, next) => {
    try {
        const documents = await Document.getAll();
        res.render('documents/index', {
            title: 'Documents RH',
            page: 'documents',
            documents
        });
    } catch (err) { next(err); }
};

exports.showAddForm = async (req, res, next) => {
    try {
        const employes = await Employe.getAll();
        res.render('documents/add', {
            title: 'Ajouter un document',
            page: 'documents',
            employes
        });
    } catch (err) { next(err); }
};

exports.store = async (req, res, next) => {
    try {
        const data = req.body;
        const fichier_url = req.file ? '/uploads/documents/' + req.file.filename : null;

        await Document.create({
            employe_id: data.employe_id || null,
            type: data.type,
            titre: data.titre,
            fichier_url
        });

        req.flash('success_msg', 'Document ajouté avec succès');
        res.redirect('/documents');
    } catch (err) { next(err); }
};

exports.showEditForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const document = await Document.getById(id);
        const employes = await Employe.getAll();
        if (!document) {
            req.flash('error_msg', 'Document introuvable');
            return res.redirect('/documents');
        }
        res.render('documents/edit', {
            title: 'Modifier le document',
            page: 'documents',
            document,
            employes
        });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const document = await Document.getById(id);
        const data = req.body;
        let fichier_url = document.fichier_url;

        if (req.file) {
            // Supprimer l'ancien fichier
            if (fichier_url && fs.existsSync('public' + fichier_url)) {
                fs.unlinkSync('public' + fichier_url);
            }
            fichier_url = '/uploads/documents/' + req.file.filename;
        }

        await Document.update(id, {
            employe_id: data.employe_id || null,
            type: data.type,
            titre: data.titre,
            fichier_url
        });

        req.flash('success_msg', 'Document modifié avec succès');
        res.redirect('/documents');
    } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        const document = await Document.getById(id);
        if (document.fichier_url && fs.existsSync('public' + document.fichier_url)) {
            fs.unlinkSync('public' + document.fichier_url);
        }
        await Document.delete(id);
        req.flash('success_msg', 'Document supprimé avec succès');
        res.redirect('/documents');
    } catch (err) { next(err); }
};
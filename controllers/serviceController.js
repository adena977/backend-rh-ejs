const Service = require('../models/serviceModel');

exports.index = async (req, res, next) => {
  try {
    const services = await Service.getAll();
    res.render('services/index', {
      title: 'Liste des services',
      page: 'services',
      services
    });
  } catch (err) {
    next(err);
  }
};

exports.showAddForm = (req, res) => {
  res.render('services/add', {
    title: 'Ajouter un service',
    page: 'services'
  });
};

exports.store = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    await Service.create({ nom, description });
    req.flash('success_msg', 'Service ajouté avec succès');
    res.redirect('/services');
  } catch (err) {
    next(err);
  }
};

exports.showEditForm = async (req, res, next) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      req.flash('error_msg', 'Service introuvable');
      return res.redirect('/services');
    }
    res.render('services/edit', {
      title: 'Modifier un service',
      page: 'services',
      service
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    await Service.update(req.params.id, { nom, description });
    req.flash('success_msg', 'Service modifié avec succès');
    res.redirect('/services');
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await Service.delete(req.params.id);
    req.flash('success_msg', 'Service supprimé avec succès');
    res.redirect('/services');
  } catch (err) {
    next(err);
  }
};

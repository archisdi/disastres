const db = require('../models/sequelize');

exports.findOne = (conditions, attributes) => db.Earthquake.findOne({ where: conditions, attributes });

exports.findAll = (conditions, attributes) => db.Earthquake.findAll({ where: conditions, attributes });

exports.create = data => db.Earthquake.create(data);

module.exports = exports;

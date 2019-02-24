const db = require('../models/sequelize');

exports.findAll = (conditions, attributes) => db.Subscriber.findAll({ where: conditions, attributes });

module.exports = exports;

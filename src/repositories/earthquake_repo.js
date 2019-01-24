const db = require('../models/sequelize');

exports.findOne = (conditions, attributes) => db.Earthquake.findOne({ where: conditions, attributes });

exports.findAll = (conditions, attributes) => db.Earthquake.findAll({ where: conditions, attributes });

exports.create = data => db.Earthquake.create(data);

exports.count = conditions => db.Earthquake.count({ where: conditions });

exports.findAndCountAll = ({
    limit, page, offset, conditions = {}, order
}) => db.Earthquake.findAndCountAll({
    where: conditions, page, limit, offset, order
});

module.exports = exports;

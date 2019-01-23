const Joi = require('joi');
const validator = require('../request-handler/validator');

const schemas = {
    list: Joi.object({
        query: Joi.object({
            limit: Joi.number().integer().default(10),
            page: Joi.number().integer().default(1)
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];

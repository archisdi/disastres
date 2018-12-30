'use strict';

const { HttpResponse } = require('../utils/helpers');

exports.retrieve = async (req, res, next) => {
    try {
        return HttpResponse(res, 'successfull');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;

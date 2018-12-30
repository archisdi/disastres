'use strict';

const Promise = require('bluebird');
const parseString = Promise.promisify(require('xml2js').parseString);

const { HttpResponse } = require('../utils/helpers');
const BMKG = require('../repositories/bmkg_repo');
const Trans = require('../utils/transformers/bmkg_transformer');

exports.checkLatest = async (req, res, next) => {
    try {
        const { data } = await BMKG.getLatestEarthquake();
        const result = await parseString(data);
        return HttpResponse(res, 'latest earthquake retrieved', Trans.normalizeQuake(result));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;

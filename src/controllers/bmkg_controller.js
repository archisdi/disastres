'use strict';

const Promise = require('bluebird');
const parseString = Promise.promisify(require('xml2js').parseString);

const { HttpResponse } = require('../utils/helpers');
const BMKG = require('../repositories/bmkg_repo');
const Trans = require('../utils/transformers/bmkg_transformer');

exports.callback = async (req, res, next) => {
    try {
        return HttpResponse(res, 'callback called');
    } catch (err) {
        return next(err);
    }
};

exports.checkLast = async (req, res, next) => {
    try {
        const { data } = await BMKG.getLastEarthquake();
        const parsed = await parseString(data);
        return HttpResponse(res, 'last earthquake retrieved', Trans.normalizeQuake(parsed.Infogempa.gempa[0]));
    } catch (err) {
        return next(err);
    }
};

exports.checkLatest = async (req, res, next) => {
    try {
        const { data } = await BMKG.getLatestEarthquake();
        const parsed = await parseString(data);
        const normalized = parsed.Infogempa.gempa.map(Trans.normalizeQuake);
        return HttpResponse(res, 'latest earthquake retrieved', normalized);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;

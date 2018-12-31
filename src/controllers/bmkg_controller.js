'use strict';

const Promise = require('bluebird');
const parseString = Promise.promisify(require('xml2js').parseString);
const hash = require('object-hash');

const { HttpResponse } = require('../utils/helpers');
const BMKG = require('../repositories/bmkg_repo');
const Trans = require('../utils/transformers/bmkg_transformer');
const EarthquakeRepo = require('../repositories/earthquake_repo');

const reseed = async () => {
    const { data } = await BMKG.getLatestEarthquake();
    const parsed = await parseString(data);
    const normalized = parsed.Infogempa.gempa.map((item) => {
        const transformed = Trans.normalizeQuake(item);
        delete transformed.affected;
        transformed.checksum = hash(transformed);
        return transformed;
    });
    await Promise.map(normalized, quake => EarthquakeRepo.findOne({ checksum: quake.checksum })
        .then(exsist => (exsist ? null : EarthquakeRepo.create(quake))), { concurrency: 10 });
};

exports.callback = async (req, res, next) => {
    try {
        await reseed();
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
        await reseed();
        return HttpResponse(res, 'latest earthquake retrieved', normalized);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;

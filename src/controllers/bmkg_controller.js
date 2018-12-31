'use strict';

const Promise = require('bluebird');
const parseString = Promise.promisify(require('xml2js').parseString);

const { HttpResponse } = require('../utils/helpers');
const BMKG = require('../repositories/bmkg_repo');
const Trans = require('../utils/transformers/bmkg_transformer');
const EarthquakeRepo = require('../repositories/earthquake_repo');
const { notifyQuake: notify } = require('../utils/notification');

const reSeedData = async () => {
    const { data } = await BMKG.getLatestEarthquake();
    const parsed = await parseString(data);
    const normalized = parsed.Infogempa.gempa.map(Trans.create);
    await Promise.map(normalized, quake => EarthquakeRepo.findOne({ checksum: quake.checksum })
        .then(exsist => (exsist ? null : EarthquakeRepo.create(quake))), { concurrency: 10 });
};

exports.callback = async (req, res, next) => {
    try {
        const { data } = await BMKG.getLastEarthquake();
        const parsed = await parseString(data);

        const transformed = Trans.create(parsed.Infogempa.gempa[0]);
        const check = await EarthquakeRepo.findOne({ checksum: transformed.checksum });
        if (check) {
            await reSeedData();
            await notify(transformed);
        }

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
        return HttpResponse(res, 'latest earthquake retrieved', parsed.Infogempa.gempa.map(Trans.normalizeQuake));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;

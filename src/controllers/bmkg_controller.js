'use strict';

const Promise = require('bluebird');
const parseString = Promise.promisify(require('xml2js').parseString);

const { HttpResponse, removeDuplicates } = require('../utils/helpers');
const BMKG = require('../repositories/bmkg_repo');
const Trans = require('../utils/transformers/bmkg_transformer');
const EarthquakeRepo = require('../repositories/earthquake_repo');
const { notifyQuake: notify } = require('../utils/notification');

const reSeedData = async (normalized) => {
    await Promise.map(normalized, quake => EarthquakeRepo.findOne({ checksum: quake.checksum })
        .then(exsist => (exsist ? null : Promise.join(EarthquakeRepo.create(quake), notify(quake)))), { concurrency: 10 });
};

exports.callback = async (req, res, next) => {
    try {
        const [{ data: felt }, { data: latest }] = await Promise.join(
            BMKG.getFeltEarthquake(),
            BMKG.getLatestEarthquake()
        );

        const { Infogempa: { Gempa: feltParsed } } = await parseString(felt);
        const { Infogempa: { gempa: latestParsed } } = await parseString(latest);

        const feltTrans = feltParsed.map(Trans.createFelt);
        const latestTrans = latestParsed.map(Trans.createLatest);
        const payload = removeDuplicates([...feltTrans, ...latestTrans], 'checksum');

        const exsist = await EarthquakeRepo.count({ checksum: payload.map(item => item.checksum) });
        if (payload.length !== exsist) await reSeedData(payload);

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

'use strict';

const Promise = require('bluebird');
const parseString = Promise.promisify(require('xml2js').parseString);

const { HttpResponse, removeDuplicates, getArrDiff } = require('../utils/helpers');
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
        const checksums = payload.map(item => item.checksum);

        // will check if there is new data
        const exsist = await EarthquakeRepo.count({ checksum: checksums });
        if (payload.length !== exsist) {
            const exsists = await EarthquakeRepo.findAll({ checksum: checksums }, ['checksum']);
            const exsistChecksums = exsists.map(item => item.checksum);
            const newQuakes = getArrDiff(checksums, exsistChecksums);
            const newPayload = payload.filter(item => newQuakes.includes(item.checksum));
            await reSeedData(newPayload);
        }

        return HttpResponse(res, 'callback called');
    } catch (err) {
        return next(err);
    }
};

exports.last = async (req, res, next) => {
    try {
        const { data } = await BMKG.getLastEarthquake();
        const parsed = await parseString(data);
        return HttpResponse(res, 'last earthquake retrieved', Trans.normalizeLatest(parsed.Infogempa.gempa[0]));
    } catch (err) {
        return next(err);
    }
};

exports.latest = async (req, res, next) => {
    try {
        const { data } = await BMKG.getLatestEarthquake();
        const parsed = await parseString(data);
        return HttpResponse(res, 'latest earthquake retrieved', parsed.Infogempa.gempa.map(Trans.normalizeLatest));
    } catch (err) {
        return next(err);
    }
};

exports.felt = async (req, res, next) => {
    try {
        const { data } = await BMKG.getFeltEarthquake();
        const parsed = await parseString(data);
        return HttpResponse(res, 'felt earthquake retrieved', parsed.Infogempa.Gempa.map(Trans.normalizeFelt));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;

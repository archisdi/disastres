const moment = require('moment-timezone');
const hash = require('object-hash');

const { DATA_SOURCE } = require('../constant');

const reduceData = data => Object.keys(data).reduce((res, key) => {
    res[key] = data[key][0];
    return res;
}, {});

const getDatetime = (data) => {
    const [hour] = data.Jam.split(' ');
    return moment(`${data.Tanggal} ${hour}`, 'DD-MMM-YY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
};

const getDatetime2 = (data) => {
    const [date] = data.Tanggal.split(' ');
    return moment(date, 'DD/MM/YYYY-HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
};

const getAffectedAreas = data => Object.keys(data).reduce((res, key) => {
    if (key.indexOf('Wilayah') !== -1) {
        const split = data[key].split(' ');
        const trans = {
            area_name: split[3],
            distance: +split[0]
        };
        res.push(trans);
    }
    return res;
}, []);

// const getAffectedAreas2 = data => data.Dirasakan;

const getCoordinates = (data) => {
    const [longitude, latitude] = data.point.coordinates[0].split(',');
    return {
        latitude: +latitude,
        longitude: +longitude
    };
};

const getCoordinates2 = (data) => {
    const [latitude, longitude] = data.point.coordinates[0].split(',');
    return {
        latitude: +latitude,
        longitude: +longitude
    };
};

const getTsunamiCond = data => data.Potensi && data.Potensi.split(' ')[0] !== 'tidak';
const getMagnitude = data => +data.Magnitude.split(' ')[0];
const getDepth = data => +data.Kedalaman.split(' ')[0];

const getDesc = data => data.Keterangan.trim();

exports.normalizeLatest = (data) => {
    const content = reduceData(data);
    const { latitude, longitude } = getCoordinates(content);
    return {
        occurs_at: getDatetime(content),
        latitude,
        longitude,
        magnitude: getMagnitude(content),
        depth: getDepth(content),
        affected: getAffectedAreas(content),
        tsunami_potential: getTsunamiCond(content)
    };
};

exports.normalizeFelt = (data) => {
    const content = reduceData(data);
    const { latitude, longitude } = getCoordinates2(content);
    return {
        occurs_at: getDatetime2(content),
        latitude,
        longitude,
        magnitude: getMagnitude(content),
        depth: getDepth(content),
        // affected: getAffectedAreas2(content),
        desc: getDesc(content)
    };
};

exports.createLatest = (data) => {
    const content = reduceData(data);
    const { latitude, longitude } = getCoordinates(content);
    const payload = {
        source: DATA_SOURCE.BMKG,
        occurs_at: getDatetime(content),
        latitude,
        longitude,
        magnitude: getMagnitude(content),
        depth: getDepth(content)
    };
    const checksum = hash(payload);
    return {
        ...payload,
        checksum
    };
};

exports.createFelt = (data) => {
    const content = reduceData(data);
    const { latitude, longitude } = getCoordinates2(content);
    const payload = {
        source: DATA_SOURCE.BMKG,
        occurs_at: getDatetime2(content),
        latitude,
        longitude,
        magnitude: getMagnitude(content),
        depth: getDepth(content)
    };
    const checksum = hash(payload);
    return {
        ...payload,
        checksum
    };
};

module.exports = exports;

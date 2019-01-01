const moment = require('moment-timezone');
const hash = require('object-hash');

const { DATA_SOURCE, TIMEZONE: TZ } = require('../constant');

const reduceData = data => Object.keys(data).reduce((res, key) => {
    res[key] = data[key][0];
    return res;
}, {});

const getDatetime = (data) => {
    const [hour] = data.Jam.split(' ');
    console.log(data.Tanggal);

    return moment(`${data.Tanggal} ${hour}`, 'DD-MMM-YY HH:mm:ss').tz(TZ.WIB).utc().format('YYYY-MM-DD HH:mm:ss');
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

const getCoordinates = (data) => {
    const [longitude, latitude] = data.point.coordinates[0].split(',');
    return {
        latitude: +latitude,
        longitude: +longitude
    };
};

const getTsunamiCond = data => data.Potensi && data.Potensi.split(' ')[0] !== 'tidak';
const getMagnitude = data => +data.Magnitude.split(' ')[0];
const getDepth = data => +data.Kedalaman.split(' ')[0];

exports.normalizeQuake = (data) => {
    const content = reduceData(data);
    const { latitude, longitude } = getCoordinates(content);
    const date = getDatetime(content);
    console.log(date);
    return {
        occurs_at: date,
        latitude,
        longitude,
        magnitude: getMagnitude(content),
        depth: getDepth(content),
        affected: getAffectedAreas(content),
        tsunami_potential: getTsunamiCond(content)
    };
};

exports.create = (data) => {
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

module.exports = exports;

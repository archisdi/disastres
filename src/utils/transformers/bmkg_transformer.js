const moment = require('moment');

exports.normalizeQuake = (data) => {
    const root = {
        ...data.Infogempa.gempa[0]
    };
    Object.keys(root).forEach((key) => { root[key] = root[key][0]; });

    const hour = root.Jam.split(' ')[0];
    const datetime = moment(`${root.Tanggal} ${hour}+07`, 'DD-MMM-YY HH:mm:ss');
    const affected = Object.keys(root).reduce((res, key) => {
        if (key.indexOf('Wilayah') !== -1) res.push(root[key]);
        return res;
    }, []);
    const coor = root.point.coordinates[0].split(',');
    const tsunami = root.Potensi.split(' ')[0] !== 'tidak';

    return {
        datetime,
        latitude: +coor[1],
        longitude: +coor[0],
        magnitude: +root.Magnitude.split(' ')[0],
        depth: +root.Kedalaman.split(' ')[0],
        affected,
        tsunami_potential: tsunami
    };
};

module.exports = exports;

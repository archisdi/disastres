const moment = require('moment');

exports.normalizeQuake = (data) => {
    Object.keys(data).forEach((key) => { data[key] = data[key][0]; });

    const hour = data.Jam.split(' ')[0];
    const occursAt = moment(`${data.Tanggal} ${hour}+07`, 'DD-MMM-YY HH:mm:ss');
    const affected = Object.keys(data).reduce((res, key) => {
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
    const coor = data.point.coordinates[0].split(',');
    const tsunami = data.Potensi && data.Potensi.split(' ')[0] !== 'tidak';

    return {
        source: 'bmkg',
        occurs_at: occursAt,
        latitude: +coor[1],
        longitude: +coor[0],
        magnitude: +data.Magnitude.split(' ')[0],
        depth: +data.Kedalaman.split(' ')[0],
        affected,
        tsunami_potential: tsunami
    };
};

module.exports = exports;

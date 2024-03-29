const axios = require('axios');
const { BMKG_URL } = require('../utils/constant');

exports.getLastEarthquake = () => axios.get(BMKG_URL.LAST_EARTHQUAKE);
exports.getLatestEarthquake = () => axios.get(BMKG_URL.LATEST_EARTHQUAKE);
exports.getFeltEarthquake = () => axios.get(BMKG_URL.ALL_EARTHQUAKE);

module.exports = exports;

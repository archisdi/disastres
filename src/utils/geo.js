const gmaps = require('./gmaps');

exports.reverseGeolocation = async (coordinates) => {
    const client = await gmaps.getClient();
    const { json: { results: data } } = await client.geocode({ address: coordinates }).asPromise();
    return data;
};
module.exports = exports;

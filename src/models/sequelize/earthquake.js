const EarthquakeSchema = require('./scheme/earthquake_scheme');

module.exports = function (sequelize, DataTypes) {
    const Member = sequelize.define('Earthquake', EarthquakeSchema(DataTypes), {
        tableName: 'earthquakes',
        underscored: true
    });

    return Member;
};

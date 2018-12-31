const EarthquakeSchema = require('../../src/models/sequelize/scheme/earthquake_scheme');

module.exports = {
    up: (queryInterface, DataTypes) => queryInterface.createTable('earthquakes', EarthquakeSchema(DataTypes)),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('earthquakes')
};

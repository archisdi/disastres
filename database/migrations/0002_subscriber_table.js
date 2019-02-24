const SubsSchema = require('../../src/models/sequelize/scheme/subscriber_scheme');

module.exports = {
    up: (queryInterface, DataTypes) => queryInterface.createTable('subscribers', SubsSchema(DataTypes)),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('subscribers')
};

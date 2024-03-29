const UserSchema = require('../../src/models/sequelize/scheme/user_scheme');

module.exports = {
    up: (queryInterface, DataTypes) => queryInterface.createTable('users', UserSchema(DataTypes)),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};

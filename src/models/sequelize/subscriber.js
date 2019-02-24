const SubsSchema = require('./scheme/subscriber_scheme');

module.exports = function (sequelize, DataTypes) {
    const Member = sequelize.define('Subscriber', SubsSchema(DataTypes), {
        tableName: 'subscribers',
        underscored: true
    });

    return Member;
};

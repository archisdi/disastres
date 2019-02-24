'use strict';

module.exports = DataTypes => ({
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    uuid: {
        type: DataTypes.UUID,
        field: 'uuid',
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        field: 'url',
        allowNull: false
    },
    secret: {
        type: DataTypes.STRING,
        field: 'secret',
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at'
    }
});

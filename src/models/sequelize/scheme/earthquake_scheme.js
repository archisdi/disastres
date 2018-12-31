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
    source: {
        type: DataTypes.STRING,
        field: 'source',
        allowNull: false
    },
    occurs_at: {
        type: DataTypes.DATE,
        field: 'occurs_at',
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        field: 'latitude',
        allowNull: false
    },
    longitude: {
        type: DataTypes.DOUBLE,
        field: 'longitude',
        allowNull: false
    },
    magnitude: {
        type: DataTypes.DOUBLE,
        field: 'magnitude',
        allowNull: false
    },
    depth: {
        type: DataTypes.DOUBLE,
        field: 'depth',
        allowNull: false
    },
    tsunami_potential: {
        type: DataTypes.BOOLEAN,
        field: 'tsunami_potential',
        defaultValue: false
    },
    checksum: {
        type: DataTypes.STRING,
        field: 'checksum',
        allowNull: false
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

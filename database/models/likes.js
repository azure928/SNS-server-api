const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'likes',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'likes',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'user_id',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'user_id' }, { name: 'post_id' }],
        },
        {
          name: 'post_id',
          using: 'BTREE',
          fields: [{ name: 'post_id' }],
        },
      ],
    }
  );
};

const { DataTypes } = require('sequelize');
const db = require('../proxy/database-proxy');

const sequelize = db.getSequelizeInstance();

const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
  });

module.exports = User;
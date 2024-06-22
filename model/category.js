const { DataTypes } = require('sequelize');
const db = require('../proxy/database-proxy');

const sequelize = db.getSequelizeInstance();

const Category = sequelize.define('Category', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  });

module.exports = Category;
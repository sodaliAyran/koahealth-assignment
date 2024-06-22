const { DataTypes } = require('sequelize');
const db = require('../proxy/database-proxy');

const sequelize = db.getSequelizeInstance();

const DifficultyLevel = sequelize.define('DifficultyLevel', {
    level: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
      unique: true,
    }
  });

module.exports = DifficultyLevel;
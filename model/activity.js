const { DataTypes } = require('sequelize');
const db = require('../proxy/database-proxy');
const Category = require('./category');
const DifficultyLevel = require('./difficulty-level');

const sequelize = db.getSequelizeInstance();

const Activity = sequelize.define('Activity', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
  
 
Activity.belongsTo(Category, { foreignKey: 'categoryId' });
Activity.belongsTo(DifficultyLevel, { foreignKey: 'difficultyLevelId' });
  
module.exports = Activity;
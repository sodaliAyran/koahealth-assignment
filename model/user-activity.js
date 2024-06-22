const { DataTypes } = require('sequelize');
const db = require('../proxy/database-proxy');
const User = require('./user');
const Activity = require('./activity');

const UserActivity = sequelize.define('UserActivity', {
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });

UserActivity.belongsTo(User, { foreignKey: 'userId' });
UserActivity.belongsTo(Activity, { foreignKey: 'activityId' });
  
module.exports = UserActivity;
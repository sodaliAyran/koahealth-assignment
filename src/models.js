const { DataTypes } = require('sequelize');
const db = require('./proxy/database-proxy');

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

const Category = sequelize.define('Category', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

const DifficultyLevel = sequelize.define('DifficultyLevel', {
    level: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
      unique: true,
    }
});

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

const UserActivity = sequelize.define('UserActivity', {
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
});

Activity.belongsTo(Category, { foreignKey: 'categoryId' });
Activity.belongsTo(DifficultyLevel, { foreignKey: 'difficultyLevelId' });

UserActivity.belongsTo(User, { foreignKey: 'userId' });
UserActivity.belongsTo(Activity, { foreignKey: 'activityId' });
  
module.exports = {User, Category, DifficultyLevel, Activity, UserActivity};
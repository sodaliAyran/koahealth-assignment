const { Category, DifficultyLevel, Activity } = require('../models');
const db = require('../proxy/database-proxy');

const sequelize = db.getSequelizeInstance();

const initialCategories = [
    { title: 'Relaxation' },
    { title: 'Self-Esteem' },
    { title: 'Productivity' },
    { title: 'Physical Health' },
    { title: 'Social Connection' }
  ];

const initialLevels = [
    { level: 'LOW' },
    { level: 'MEDIUM' },
    { level: 'HIGH' }
  ];

const initialActivities = [
    {
        title: 'Activity 1',
        description: 'Description of Activity 1',
        duration: 30,
        content: 'Content of Activity 1',
        categoryId: 1,
        difficultyLevelId: 1
      },
      {
        title: 'Activity 2',
        description: 'Description of Activity 2',
        duration: 45,
        content: 'Content of Activity 2',
        categoryId: 2,
        difficultyLevelId: 2
      },
      {
        title: 'Activity 3',
        description: 'Description of Activity 3',
        duration: 15,
        content: 'Content of Activity 3',
        categoryId: 3,
        difficultyLevelId: 3
      },
      {
        title: 'Activity 4',
        description: 'Description of Activity 4',
        duration: 10,
        content: 'Content of Activity 4',
        categoryId: 4,
        difficultyLevelId: 1
      },
      {
        title: 'Activity 5',
        description: 'Description of Activity 5',
        duration: 60,
        content: 'Content of Activity 5',
        categoryId: 5,
        difficultyLevelId: 3
      },
];
  
async function initializeDatabase() {
    try {
      await sequelize.sync();
  
      for (const category of initialCategories) {
        await Category.findOrCreate({ where: { title: category.title }, defaults: category });
      }
  
      for (const level of initialLevels) {
        await DifficultyLevel.findOrCreate({ where: { level: level.level }, defaults: level });
      }
  
      for (const activity of initialActivities) {
        await Activity.findOrCreate({ where: { title: activity.title }, defaults: activity });
      }
  
      console.info('Database initialized with initial data.');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  module.exports = initializeDatabase
const { Sequelize } = require('sequelize');

class Database {
  constructor() {
    if (!Database.instance) {
      this._sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite',
      });
      Database.instance = this;
    }

    return Database.instance;
  }

  getSequelizeInstance() {
    return this._sequelize;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
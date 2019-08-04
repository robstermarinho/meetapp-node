import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/Users';
import File from '../models/File';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // Call associate method if the it exists.
  }
}

export default new Database();

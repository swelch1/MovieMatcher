'use strict';
require('dotenv').config();

import { Sequelize, DataTypes } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = process.env.DATABASE || config.url;

const sequelize = config.url
  ? new Sequelize(db, config)
  : new Sequelize(config.database, config.username, config.password, config);

async function connectDB() {
  try {
    await sequelize.authenticate();
    config.url ? console.log('connected to remote DB') : console.log('connected to local DB');
  } catch (e) {
    console.log('connection failed: ' + e);
  }
}

export { Sequelize, sequelize, DataTypes, connectDB }

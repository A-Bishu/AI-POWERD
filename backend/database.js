// database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Loads from .env file
}

const isProduction = process.env.NODE_ENV === 'production';

const sequelizeConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: !isProduction, // Disable logging in production
};

if (isProduction) {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Allows self-signed certificates
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeConfig
);

// Import and initialize models
const User = require('./models/User')(sequelize);
const MatchPrediction = require('./models/MatchPrediction')(sequelize);

// Define syncDatabase as an async function
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    if (!isProduction) {
      await sequelize.sync({ alter: true }); // Update schema in development
      console.log('Database schema synchronized successfully.');
    }
  } catch (error) {
    if (error.name === 'SequelizeConnectionError') {
      console.error('Database connection error:', error.message);
    } else {
      console.error('Error during database synchronization:', error.message);
    }
  }
};


// Export sequelize instance, syncDatabase, and models
module.exports = { sequelize, syncDatabase, User, MatchPrediction };

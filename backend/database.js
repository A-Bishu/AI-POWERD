// database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    /*
   dialectOptions: {
      ssl: {
       require: true,
       rejectUnauthorized: false,
     },
    },*/
  }
);

// Import and initialize models
const User = require('./models/User')(sequelize);
const MatchPrediction = require('./models/MatchPrediction')(sequelize);

// Define syncDatabase as an async function
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

// Export sequelize instance, syncDatabase, and models
module.exports = { sequelize, syncDatabase, User, MatchPrediction };

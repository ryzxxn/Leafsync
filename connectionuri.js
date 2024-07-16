const { Sequelize } = require('sequelize');
const { Client } = require('pg');

// Replace this with the connection URI for your Render.com PostgreSQL database
const connectionURI = "postgresql://leafsync_owner:lSOw8ms7Qgnv@ep-silent-moon-a1kvg31f.ap-southeast-1.aws.neon.tech/leafsync?sslmode=require";

// Create a new Sequelize instance with the connection URI
const sequelize = new Sequelize(connectionURI);

// Test the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// const client = new Client({
//     connectionString: connectionURI,
//   });
  
//   // Connect to the database
//   client.connect()
//     .then(() => {
//       console.log('Connected to the database');
//       // Test the connection by executing a simple query
//       return client.query('SELECT NOW()');
//     })
//     .then(result => {
//       console.log('Query result:', result.rows[0]);
//     })
//     .catch(err => {
//       console.error('Unable to connect to the database:', err);
//     })
//     .finally(() => {
//       // Close the database connection
//       client.end();
//     });

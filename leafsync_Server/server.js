const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const port = 6767;
app.use(cors());
app.use(bodyParser.json());

// Create a function to create a new Sequelize instance
function createSequelizeInstance(connectionURI, database_name, username, password, hostname, dialect, port) {
  if (connectionURI) {
    return new Sequelize(connectionURI);
  } else {
    return new Sequelize(database_name ?? '', username ?? '', password ?? '', {
      host: hostname ?? 'localhost',
      dialect: dialect ?? 'mysql',
      port: port ?? 3306,
    });
  }
}

// Define a route handler for testing the database connection
// Define a route handler for testing the database connection
app.post('/connect', (req, res) => {
  const { connectionURI, hostname, password, username, database_name, dialect, port } = req.body;
  const sequelize = createSequelizeInstance(connectionURI, database_name, username, password, hostname, dialect, port);

  // Test the connection
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
      res.sendStatus(400);
    });
});


// Define a route handler for getting all tables in the database
app.post('/gettable', (req, res) => {
  const { hostname, password, username, database_name, dialect, port, connectionURI } = req.body;
  const sequelize = createSequelizeInstance(connectionURI, database_name, username, password, hostname, dialect, port);

  // Test the connection
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      let query;
      if (dialect === 'postgres') {
        query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
      } else if (dialect === 'mysql') {
        query = "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()";
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      // Get all tables in the database
      return sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
      });
    })
    .then(tables => {
      console.log('Tables in the database:', tables);
      res.json(tables);
    })
    .catch(err => {
      console.error('Unable to get tables in the database:', err);
      res.sendStatus(500);
    });
});


// Define a route handler for getting all data from a specific table in the database
app.post('/gettabledata', (req, res) => {
  const { connectionURI, hostname, password, username, database_name, dialect, port, table_name } = req.body;
  const sequelize = createSequelizeInstance(connectionURI, hostname, password, username, database_name, dialect, port);

  // Test the connection
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      // Get all data from the specified table
      return sequelize.query(`SELECT * FROM ${table_name}`, {
        type: sequelize.QueryTypes.SELECT
      });
    })
    .then(data => {
      console.log(`Data from table ${table_name}:`, data);
      res.json(data);
    })
    .catch(err => {
      console.error(`Unable to get data from table ${table_name}:`, err);
      res.sendStatus(500);
    });
});

// Start the server listening on the defined port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

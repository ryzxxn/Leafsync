const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

/////////////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE
/////////////////////////////////////////////////////////////////////////////////////
app.use(cors());
app.use(express.json());

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('Hello World!');
});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.post('/Connect', (req, res) => {
    const { host, username, password, database } = req.body;

    console.log(host , username, password ,database);

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    });

    connection.connect((err) => {
        if (err) {
            res.status(500).send('Failed to connect to the database.');
            return;
        }
        res.status(200).send('Connection successful');
    });
    connection.end();
});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.post('/Table', (req, res) => {
    const { host, username, password, database } = req.body;

    // Create a connection to the MySQL database
    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    });

    // Connect to the MySQL database
    connection.connect((err) => {
        if (err) {
            res.status(500).send('Failed to connect to the database.');
            return;
        }

        // Retrieve list of databases
        connection.query('SHOW DATABASES', (err, results) => {
            if (err) {
                res.status(500).send('Failed to retrieve databases from the server.');
                return;
            }

            // List of databases to ignore
            const ignoreDatabases = ['information_schema', 'mysql', 'performance_schema', 'phpmyadmin'];

            // Filter out ignored databases
            const filteredDatabases = results.filter((db) => !ignoreDatabases.includes(db.Database));

            // Retrieve tables for each filtered database
            const databaseTablesPromises = filteredDatabases.map((db) => {
                return new Promise((resolve, reject) => {
                    connection.query(`SHOW TABLES IN ${db.Database}`, (err, tables) => {
                        if (err) {
                            reject(`Failed to retrieve tables for database ${db.Database}`);
                            return;
                        }
                        resolve({ database: db.Database, tables: tables.map((table) => table[`Tables_in_${db.Database}`]) });
                    });
                });
            });

            // Wait for all database tables requests to complete
            Promise.all(databaseTablesPromises)
                .then((databaseTables) => {
                    // Send the filtered databases along with their tables as a response
                    res.status(200).send(databaseTables);
                })
                .catch((error) => {
                    res.status(500).send(error);
                })
                .finally(() => {
                    // Close the database connection
                    connection.end();
                });
        });
    });
});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.post('/TableData', (req, res) => {
    const { host, username, password, database, table } = req.body;

    // Create a connection to the MySQL database
    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    });

    // Connect to the MySQL database
    connection.connect((err) => {
        if (err) {
            res.status(500).send('Failed to connect to the database.');
            return;
        }

        // Retrieve data from the specified table
        connection.query(`SELECT * FROM \`${table}\``, (err, results) => {
            if (err) {
                res.status(500).send(`Failed to retrieve data from table ${table}`);
                return;
            }

            // Send the table data as a response
            res.status(200).send(results);
        });
    });
});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.post('/Query', (req, res) => {
    const { host, username, password, database, query } = req.body;
  
    const connection = mysql.createConnection({
      host: host,
      user: username,
      password: password,
      database: database
    });
  
    connection.connect((err) => {
      if (err) {
        console.error('Failed to connect to the database:', err);
        res.status(500).send('Failed to connect to the database.');
        return;
      }
  
      // RUN QUERY
      connection.query(query, (err, results, fields) => {
        if (err) {
          console.error('Failed to execute query:', err);
          res.status(400).send(err.sqlMessage);
          return;
        }
  
        const DATA = {
          results,
          fields
        }
  
        // Send the table data as a response with a status code of 200
        res.status(200).send(DATA);
      });
  
      // Close the connection
      connection.end((err) => {
        if (err) {
          res.status(400).send(err)
          return;
        }
      });
    });
  });  
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.post('/Fields', (req, res) => {
    const { host, username, password, database, table } = req.body;

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    });

    connection.connect((err) => {
        if (err) {
            res.status(500).send('Failed to connect to the database.');
            return;
        }

        // RUN QUERY TO GET FIELDS AND THEIR DATA TYPES
        const query = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${table}'`;

        connection.query(query, (err, results, fields) => {
            if (err) {
                res.status(500).send(`Failed to retrieve fields from the table.`);
                return;
            }

            // Send the field data as a response
            res.status(200).send(results);
        });
    });
});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const port = 6767;
app.use(cors());
app.use(bodyParser.json());

let sequelizeInstance = null;

// Default port mapping for different database dialects
const defaultPorts = {
  mysql: 3306,
  postgres: 5432,
  sqlite: null,  // SQLite doesn't need a port
  mssql: 1433,
  oracle: 1521,
};

// Create a function to create a new Sequelize instance
function createSequelizeInstance(connectionURI, database_name, username, password, hostname, dialect, port) {
  // Check if the dialect is supported
  if (!defaultPorts.hasOwnProperty(dialect)) {
    throw new Error(`Unsupported dialect: ${dialect}`);
  }

  // Use the provided port or fallback to the default port for the selected dialect
  const selectedPort = port || defaultPorts[dialect];

  if (connectionURI) {
    return new Sequelize(connectionURI, {
      ssl: { rejectUnauthorized: false }
    });
  } else {
    return new Sequelize(database_name ?? '', username ?? '', password ?? '', {
      host: hostname ?? 'localhost',
      dialect: dialect,
      port: selectedPort,  // Use the computed port
      logging: console.log, // Enable logging for debugging
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define a route handler for testing the database connection
app.post('/connect', async (req, res) => {
  const { connectionURI, hostname, password, username, database_name, dialect, port } = req.body;

  try {
    // Create Sequelize instance
    sequelizeInstance = createSequelizeInstance(connectionURI, database_name, username, password, hostname, dialect, port);

    // Test the connection
    await sequelizeInstance.authenticate();
    // console.log('Connection has been established successfully.');
    res.sendStatus(200);
  } catch (error) {
    // Handle invalid dialect or other errors
    console.error('Unable to connect to the database:', error.message);
    res.status(400).json({ error: 'Unable to connect to the database', details: error.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/getschemas', async (req, res) => {
  if (!sequelizeInstance) {
    return res.status(400).send('Database connection not established.');
  }

  const query = `
    SELECT 
      s.schema_name,
      COUNT(t.table_name) AS table_count,
      pg_size_pretty(SUM(pg_total_relation_size(quote_ident(t.table_schema) || '.' || quote_ident(t.table_name)))) AS schema_size
    FROM 
      information_schema.schemata s
    LEFT JOIN 
      information_schema.tables t 
      ON t.table_schema = s.schema_name
    WHERE 
      s.schema_name NOT IN ('pg_catalog', 'information_schema')  -- Exclude system schemas
    GROUP BY 
      s.schema_name;
  `;

  try {
    const schemas = await sequelizeInstance.query(query, {
      type: sequelizeInstance.QueryTypes.SELECT
    });
    res.json(schemas);  // Return schemas with additional information
  } catch (err) {
    console.error('Unable to get schemas:', err);
    res.status(500).json({ error: 'Unable to get schemas in the database', details: err.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/getschema-details', async (req, res) => {
  if (!sequelizeInstance) {
    return res.status(400).send('Database connection not established.');
  }

  const { schemaName } = req.body; // The schema name should be provided in the request body

  if (!schemaName) {
    return res.status(400).send('Schema name is required.');
  }

  const query = `
    WITH table_details AS (
      SELECT
        t.table_name,
        t.table_schema,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        c.ordinal_position,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND kcu.table_name = t.table_name
            AND kcu.column_name = c.column_name
            AND kcu.table_schema = t.table_schema
          ) THEN TRUE
          ELSE FALSE
        END AS is_primary_key
      FROM information_schema.tables t
      JOIN information_schema.columns c
      ON t.table_name = c.table_name
      AND t.table_schema = c.table_schema
      WHERE t.table_schema = :schemaName
    ),
    foreign_keys AS (
      SELECT
        tc.table_name,
        tc.table_schema,
        kcu.column_name,
        tc.constraint_name,
        tc.constraint_type,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = :schemaName
    )
    SELECT
      td.table_name,
      td.column_name,
      td.data_type,
      td.is_nullable,
      td.column_default,
      td.ordinal_position,
      td.is_primary_key,
      fk.foreign_table_name,
      fk.foreign_column_name
    FROM table_details td
    LEFT JOIN foreign_keys fk
    ON td.table_name = fk.table_name
    AND td.column_name = fk.column_name
    AND td.table_schema = fk.table_schema
    ORDER BY td.table_name, td.ordinal_position;
  `;

  try {
    const results = await sequelizeInstance.query(query, {
      replacements: { schemaName },
      type: sequelizeInstance.QueryTypes.SELECT
    });

    // Organize results into a structured format
    const tables = results.reduce((acc, row) => {
      if (!acc[row.table_name]) {
        acc[row.table_name] = {
          columns: [],
          foreign_keys: []
        };
      }

      acc[row.table_name].columns.push({
        column_name: row.column_name,
        data_type: row.data_type,
        is_nullable: row.is_nullable,
        column_default: row.column_default,
        is_primary_key: row.is_primary_key
      });

      if (row.foreign_table_name) {
        acc[row.table_name].foreign_keys.push({
          column_name: row.column_name,
          foreign_table_name: row.foreign_table_name,
          foreign_column_name: row.foreign_column_name
        });
      }

      return acc;
    }, {});

    res.json(tables);
  } catch (err) {
    console.error('Unable to get schema details:', err);
    res.status(500).json({ error: 'Unable to get schema details from the database', details: err.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a route handler for getting all tables in the database
app.post('/gettable', (req, res) => {
  if (!sequelizeInstance) {
    return res.status(400).send('Database connection not established.');
  }

  let query;
  const { dialect } = req.body;

  if (dialect === 'postgres') {
    // For PostgreSQL: Get table name, table schema, and table type
    query = `
      SELECT 
        table_name, 
        table_schema, 
        table_type 
      FROM information_schema.tables;
    `;
  } else if (dialect === 'mysql') {
    // For MySQL: Get table name, table schema, and table type
    query = `
      SELECT 
        table_name, 
        table_schema, 
        table_type 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE();
    `;
  } else {
    return res.status(400).send(`Unsupported dialect: ${dialect}`);
  }

  // Get all tables in the database with additional info
  sequelizeInstance.query(query, {
    type: sequelizeInstance.QueryTypes.SELECT
  })
    .then(tables => {
      res.json(tables);
    })
    .catch(err => {
      console.error('Unable to get tables in the database:', err);
      res.status(500).json({ error: 'Unable to get tables in the database', details: err.message });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a route handler for getting all data from a specific table in the database
app.post('/gettabledata', (req, res) => {
  if (!sequelizeInstance) {
    return res.status(400).send('Database connection not established.');
  }

  const { table_name } = req.body;

  // Get all data from the specified table
  sequelizeInstance.query(`SELECT * FROM ${table_name}`, {
    type: sequelizeInstance.QueryTypes.SELECT
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start the server listening on the defined port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
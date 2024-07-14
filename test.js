const { Client } = require('pg');

const client = new Client({
  user: 'postgres.dnmqceglkwesvnbecshn',
  password: 'fvERA_TX-4$S6kh',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
    client.end();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
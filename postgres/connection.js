const { Client } = require('pg');

const client = new Client( {
  host:"localhost",
  user: "postgres",
  port: 5433,
  password: "Saurav@132",
  database: "IRIS"
});

module.exports = client;

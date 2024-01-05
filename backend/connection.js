const { Client } = require('pg');

// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5433,
//   password: "Saurav@132",
//   database: "IRIS"
// });
// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5432,
//   password: "Pavan@123",
//   database: "IRIS"
// });
const client = new Client( {
  host:"localhost",
  user: "postgres",
  port: 5432,
  password: "rimes@123",
  database: "IRIS"
});

module.exports = client;

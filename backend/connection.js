const { Client } = require('pg');


const client = new Client( {
  host:"localhost",
  user: "postgres",
  port: 5432,
  password: "rimes@123",
  database: "IRIS"
});
// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5432,
//   password: "123456",
//   database: "IRIS"
// });

// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5432,
//   password: "12345",
//   database: "iris"
// });

module.exports = client;
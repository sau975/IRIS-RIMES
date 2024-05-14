const { Client } = require('pg');

// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5433,
//   password: "Saurav@132",
//   database: "IRIS"
// });

<<
<< << < HEAD
    ===
    === =
    // const client = new Client( {
    //   host:"localhost",
    //   user: "postgres",
    //   port: 5432,
    //   password: "iru@ADMIN123",
    //   database: "iru_imd_db"
    // });
    const client = new Client({
        host: "localhost",
        user: "postgres",
        port: 5432,
        password: "2020",
        database: "IRIS"
    });

module.exports = client;
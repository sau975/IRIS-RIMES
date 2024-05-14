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
    // const client = new Client( {
    //   host:"localhost",
    //   user: "postgres",
    //   port: 5432,
    //   password: "123456",
    //   database: "IRIS"
    // });

    >>>
    >>> > refs / remotes / origin / main
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    <<
    << << < HEAD
    password: "iru@ADMIN123",
    database: "iru_imd_db" ===
        === =
        password: "12345",
    database: "iris" >>>
        >>> > refs / remotes / origin / main
});
// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5432,
//   password: "123456",
//   database: "IRIS"
// });

module.exports = client;
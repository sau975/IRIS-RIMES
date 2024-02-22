const { Client } = require('pg');

const client = new Client( {
  host:"localhost",
  user: "postgres",
  port: 5433,
  password: "Saurav@132",
  database: "IRIS"
});
// const client = new Client( {
//   host:"localhost",
//   user: "postgres",
//   port: 5432,
//   password: "Pavan@123",
//   database: "IRIS"
// });
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
//   password: "rimes@123",
//   database: "IRIS"
// });




// FTP
// const fs = require('fs');
// const ftp = require('ftp');

// const ftpConfig = {
//   host: '192.168.14.196',
//   port: 21, // Default FTP port
//   user: 'iris',
//   password: 'Hydro@iris'
// };

// const postgresConfig = {
//   host:"localhost",
//   user: "postgres",
//   port: 5433, // Default PostgreSQL port
//   password: "Saurav@132",
//   database: "IRIS"
// };

// const clientFtp = new ftp();
// const clientPostgres = new Client(postgresConfig);

// // Connect to the FTP server
// clientFtp.connect(ftpConfig);

// // Handle 'ready' event for FTP
// clientFtp.on('ready', () => {
//   console.log('Connected to FTP server');

//   const remoteFilePath = '/06022024.xlsx';

//   // Download the file from FTP
//   clientFtp.get(remoteFilePath, (err, stream) => {
//     if (err) {
//       console.error(`Error downloading file from FTP: ${err.message}`);
//       clientFtp.end();
//       return;
//     }

//     // Read the content of the file
//     let fileContent = '';
//     stream.on('data', (chunk) => {
//       fileContent += chunk.toString();
//     });

//     // Handle the end of the download
//     stream.on('end', () => {
//       console.log('File downloaded from FTP');

//       // Connect to PostgreSQL database
//       clientPostgres.connect()
//         .then(() => {
//           console.log('Connected to PostgreSQL database');

//           const insertQuery = 'INSERT INTO stationdatadaily 05_Feb_24 VALUES ($1)';
//           const values = [fileContent];

//           // Execute the PostgreSQL query to insert data
//           return clientPostgres.query(insertQuery, values);
//         })
//         .then(() => {
//           console.log('Data inserted into PostgreSQL database');
//         })
//         .catch((dbError) => {
//           console.error(`Error inserting data into PostgreSQL: ${dbError.message}`);
//         })
//         .finally(() => {
//           // Close connections
//           clientPostgres.end();
//           clientFtp.end();
//         });
//     });

//     // Handle errors during the FTP download
//     stream.on('error', (downloadError) => {
//       console.error(`Error during FTP download: ${downloadError.message}`);
//       clientFtp.end();
//     });
//   });
// });

// // Handle 'error' event for FTP
// clientFtp.on('error', (err) => {
//   console.error(`FTP error: ${err.message}`);
// });



// const ftp = require('ftp');

// const config = {
//   host: '192.168.14.196',
//   port: 21,
//   user: 'iris',
//   password: 'Hydro@iris'
// };

// const clientftp = new ftp();

// clientftp.on('ready', () => {
//   console.log('Connected to FTP server');

//   clientftp.pwd((err, currentDir) => {
//     if (err) {
//       console.error('Error getting current working directory:', err);
//       clientftp.end();
//       return;
//     }
  
//     console.log('Current working directory:', currentDir);
//   });
  
//   // List contents of the remote directory
//   clientftp.list((err, list) => {
//     if (err) {
//       console.error('Error listing directory:', err);
//       clientftp.end();
//       return;
//     }

//     console.log('Directory listing:');
//     console.log(list);

//     // Download a file from the FTP server
//     const remoteFilePath = '/Rainfall/';
//     const localFilePath = 'local/file.txt';

//     clientftp.get(remoteFilePath, (err, stream) => {
//       if (err) {
//         console.error(`Error downloading file ${remoteFilePath}:`, err);
//         clientftp.end();
//         return;
//       }

//       stream.once('close', () => {
//         clientftp.end();
//         console.log(`File ${remoteFilePath} downloaded to ${localFilePath}`);
//       });

//       stream.pipe(require('fs').createWriteStream(localFilePath));
//     });
//   });
// });

// clientftp.on('error', (err) => {
//   console.error('FTP connection error:', err);
//   clientftp.end();
// });

// clientftp.connect(config);


module.exports = client;

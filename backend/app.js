const client = require("./connection");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
// const cron = require('node-cron');

// cron.schedule('0 14 * * *', () => {
// });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/addData', (req, res) => {
  const data = req.body.data; 
  client.query('INSERT INTO existingstationdata(stationname, stationid, datetime, stationtype, neworold, lat, lng, activationdate) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [data.stationName, data.stationId, data.dateTime, data.stationType, data.newOrOld, data.lat, data.lng, data.activationDate])
    .then(() => {
      res.status(200).json({ message: 'Data inserted successfully' });
    })
    .catch(error => {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


app.put("/updateexistingstationdata", (req, res) => {
  const data = req.body.data;
  client.query('UPDATE existingstationdata SET stationname = $1, stationid = $2, datetime = $3, stationtype = $4, neworold = $5, lat = $6, lng = $7, activationdate = $8 WHERE stationid = $9', [
      data.stationname,
      data.stationid,
      data.dateTime, 
      data.stationType, 
      data.newOrOld, 
      data.lat, 
      data.lng, 
      data.activationDate,
      data.previousstationid
    ])
    .then(() => {
      res.status(200).json({ message: `Row with ID ${data.previousstationid} updated successfully` });
    })
    .catch((error) => {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});
app.delete("/deleteexistingstationdata", (req, res) => {
  const data = req.body.data; 
  client
    .query('DELETE FROM existingstationdata WHERE stationid = $1', [data])
    .then(() => {
      res.status(200).json({ message: `Row with stationid ${data} deleted successfully` });
    })
    .catch((error) => {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get("/existingstationdata", (req, res) => {
  client.query(
    "SELECT * FROM existingstationdata JOIN stationdatadaily ON existingstationdata.stationid = stationdatadaily.station_id ORDER BY station_id",
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }else{
        res.send(err);
      }
    }
  );
});

app.get("/masterFile", (req, res) => {
  client.query(
    "SELECT * FROM masterfile JOIN stationdatadaily ON masterfile.station_code = stationdatadaily.station_id ORDER BY station_id",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  
  );
 
});

app.get("/districtdep", (req, res) => {
  client.query(
    "SELECT * FROM ndistrict ORDER BY district_code ASC",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});
app.get("/statenormal", (req, res) => {
  client.query(
    "SELECT * FROM nstate",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});
app.get("/subdivnormal", (req, res) => {
  client.query(
    "SELECT * FROM nsubdivision",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});

app.get("/regionnormal", (req, res) => {
  client.query(
    "SELECT * FROM nregion",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});
app.get("/countrynormal", (req, res) => {
  client.query(
    "SELECT * FROM ncountry",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});


const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');
  return secretKey;
};

const secretKey = generateSecretKey();
app.post("/login", (req, res) => {
  client.query(
    `SELECT * FROM login WHERE username = '${req.body.username}' AND password = '${req.body.password}';`,
    (err, result) => {
      console.log(result.rows, "hhhh")
      if (err) {
        res.send({message: "Server Error", err});
      }else{
        if(result.rows.length){
          const user = {
            userName:  req.body.username,
            password:  req.body.password
          }
          jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
            res.json({message: "Login successful", token: token, data: result.rows})
          })
        }else{
          res.send({message: "Username and Passwrod are Invalid"});
        }
      }
    }
  );
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;
        const sectionName = req.body.sectionName;
        const result = await client.query(
            'INSERT INTO pdf_files (file_name, file_data, section_name) VALUES ($1, $2, $3) RETURNING id',
            [originalname, buffer, sectionName]
        );
        res.json({ success: true, fileId: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get("/uploadedfiles", (req, res) => {
  client.query(
    "SELECT * FROM pdf_files",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});

app.get('/download/:id', async (req, res) => {
  try {
      const fileId = req.params.id;
      const result = await client.query('SELECT * FROM pdf_files WHERE id = $1', [fileId]);

      if (result.rows.length === 0) {
          res.status(404).json({ success: false, error: 'File not found' });
          return;
      }

      const { file_name, file_data } = result.rows[0];
      res.setHeader('Content-Disposition', `attachment; filename=${file_name}`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(file_data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/uploadrainfalldata', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // const client = new Client(dbConfig);
    // await client.connect();

    // Replace with your PostgreSQL table name
    const tableName = 'existingstationdata';

    await client.query(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        stationname character varying COLLATE pg_catalog."default",
        stationid numeric,
        datetime character varying COLLATE pg_catalog."default",
        stationtype character varying COLLATE pg_catalog."default",
        neworold character varying COLLATE pg_catalog."default",
        lat character varying COLLATE pg_catalog."default",
        lng character varying COLLATE pg_catalog."default",
        activationdate character varying COLLATE pg_catalog."default"
      );`
    );

    for (const row of sheetData) {
      const values = Object.values(row)
        .map(value => `'${value}'`)
        .join(', ');
      await client.query(`INSERT INTO ${tableName} VALUES (${values});`);
    }

    // await client.end();
    res.status(200).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put("/updaterainfall", (req, res) => {
  const data = req.body.data;
  try {
    // Begin a transaction
    client.query('BEGIN');
    // Loop through each object and insert into the database
    for (const element of data.updatedstationdata) {
      const queryText = `UPDATE stationdatadaily SET "${data.date}" = ${element.RainFall} WHERE station_id = ${element.stationid}`;
      // Execute the query
      client.query(queryText);
    }
    // Commit the transaction
    client.query('COMMIT');
    res.status(200).json({ message: `Updated successfully`});
    console.log('Data inserted successfully!');
  }
   catch (error) {
    // Rollback the transaction in case of an error
    client.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
    console.error('Error inserting data:', error);
  }
});



app.listen(3000, () => {
  console.log("Server has been ready");
});
client.connect();


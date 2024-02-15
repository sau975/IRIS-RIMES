const client = require("./connection");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
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
  client.query('INSERT INTO existingstationdata(stationname, stationid) VALUES($1, $2)', [data.field1, data.field2])
    .then(() => {
      res.status(200).json({ message: 'Data inserted successfully' });
    })
    .catch(error => {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


app.put("/existingstationdata", (req, res) => {
  const data = req.body.data;
  client.query('UPDATE existingstationdata SET stationname = $1, stationid = $2 WHERE stationid = $3', [
      data.stationname,
      data.stationid,
      data.previousstationid,
    ])
    .then(() => {
      res.status(200).json({ message: `Row with ID ${data.previousstationid} updated successfully` });
    })
    .catch((error) => {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});
app.delete("/existingstationdata", (req, res) => {
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
    "SELECT * FROM existingstationdata ORDER BY stationid",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
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
            res.json({message: "Login successful", token: token})
          })
        }else{
          res.send({message: "Username and Passwrod are Invalid"});
        }
      }
    }
  );
});

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Insert file into database
    const result = await pool.query('INSERT INTO files (name, data) VALUES ($1, $2) RETURNING id', [fileName, fileBuffer]);

    res.status(200).json({ fileId: result.rows[0].id, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(3000, () => {
  console.log("Server has been ready");
});
client.connect();


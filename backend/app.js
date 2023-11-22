const client = require("./connection");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser = require('body-parser');

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

app.get("/masterFile", (req, res) => {
  client.query(
    "SELECT * FROM masterfile JOIN dailystationdata ON masterfile.crisid = dailystationdata.cris_id ORDER BY districtid",
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
    "SELECT * FROM ndistrict JOIN del1 ON ndistrict.districtid = del1.districtid ORDER BY del1.subdivid1, del1.stateid",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});
app.get("/statedaily", (req, res) => {
  client.query(
    "SELECT * FROM del1 ORDER BY regionid, stateid ASC",
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

app.get("/subdivdaily", (req, res) => {
  client.query(
    "SELECT * FROM del1 ORDER BY subdivid ASC",
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

app.get("/regiondaily", (req, res) => {
  client.query(
    "SELECT * FROM del1 ORDER BY regionid ASC",
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

app.listen(3000, () => {
  console.log("Server has been ready");
});
client.connect();


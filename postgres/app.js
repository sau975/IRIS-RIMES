const client = require("./connection");
const express = require("express");
const app = express();
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

app.get("/masterFile", (req, res) => {
  client.query(
    "SELECT * FROM masterfile",
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result.rows);
    }
  );
});

app.listen(3000, () => {
  console.log("Server has been ready");
});
client.connect();


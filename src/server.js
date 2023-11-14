const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'pavan',
  host: 'localhost',
  database: 'IRIS',
  password: 'Pavan@123',
  port: 5432,
});

app.use(express.json());

app.get('/revised/DistrictID', async (req, res) => {
  const districtId = req.params.DistrictID;

  try {
    const query = 'SELECT * FROM revised WHERE districtid = $1';
    const result = await pool.query(query, [districtId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

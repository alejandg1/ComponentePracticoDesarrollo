const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const App = express();
const port = 5000;

App.use(cors());
App.use(bodyParser.json());

const db = new pg.Pool({
  user: 'practica_user',
  host: 'db',
  database: 'practica_db',
  password: 'practica_pass',
  port: 5432,
});

App.post('/users', async (req, res) => {
  const { dni, nombre, apellido, fecha_nacimiento, genero, ciudad } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO usuarios (dni, nombre, apellido, fecha_nacimiento, genero, ciudad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [dni, nombre, apellido, fecha_nacimiento, genero, ciudad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

App.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuarios');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

App.put('/users/:dni', async (req, res) => {
  const { dni } = req.params;
  const { nombre, apellido, fecha_nacimiento, genero, ciudad } = req.body;
  try {
    const result = await db.query(
      'UPDATE usuarios SET nombre=$1, apellido=$2, fecha_nacimiento=$3, genero=$4, ciudad=$5 WHERE dni=$6 RETURNING *',
      [nombre, apellido, fecha_nacimiento, genero, ciudad, dni]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Database error' });
  }
});

App.delete('/users/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const result = await db.query('DELETE FROM usuarios WHERE dni=$1 RETURNING *', [dni]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


App.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

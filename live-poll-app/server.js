const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

app.use(express.json());

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS polls (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      options TEXT[] NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      poll_id INTEGER REFERENCES polls(id),
      selected_option TEXT NOT NULL,
      username TEXT NOT NULL,
      voted_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('DB schema initialized');
}

initDB().catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});

// Endpoint pour lister tous les sondages
app.get('/api/polls', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM polls ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Endpoint pour récupérer un sondage par ID
app.get('/api/polls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'Sondage non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Endpoint pour créer un nouveau sondage
app.post('/api/polls', async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).send({ error: 'Question et options sont requises.' });
    }
    const newPoll = await pool.query(
      'INSERT INTO polls (question, options) VALUES ($1, $2) RETURNING *',
      [question, options]
    );
    res.status(201).json(newPoll.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Endpoint to get all votes for a poll
app.get('/api/polls/:id/votes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT username, selected_option, voted_at FROM votes WHERE poll_id = $1 ORDER BY voted_at ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.listen(port, () => console.log(`🚀 Poll-service (avec DB) démarré sur le port ${port}`));
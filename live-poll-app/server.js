const express = require('express');
const { Pool, Client } = require('pg');
const app = express();
const port = 3001;

app.use(express.json());

const pgConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

// Configuration de la connexion à la base de données
const pool = new Pool(pgConfig);

// In-memory map: pollId -> Set of SSE res objects
const sseClients = new Map();

// Dedicated client for LISTEN
const listenClient = new Client(pgConfig);
listenClient.connect().then(() => {
  return listenClient.query('LISTEN votes_updated');
}).then(() => {
  console.log('Listening for votes_updated notifications');
}).catch(err => console.error('LISTEN setup failed:', err));

listenClient.on('notification', async (msg) => {
  const pollId = msg.payload;
  const clients = sseClients.get(pollId);
  if (!clients?.size) return;
  try {
    const result = await pool.query(
      'SELECT username, selected_option, voted_at FROM votes WHERE poll_id = $1 ORDER BY voted_at ASC',
      [pollId]
    );
    const data = JSON.stringify(result.rows);
    for (const res of clients) {
      res.write(`data: ${data}\n\n`);
    }
  } catch (err) {
    console.error('Failed to fetch votes for notification:', err);
  }
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

// SSE endpoint - streams live vote updates
app.get('/api/polls/:id/votes/stream', async (req, res) => {
  const pollId = req.params.id;
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  try {
    const result = await pool.query(
      'SELECT username, selected_option, voted_at FROM votes WHERE poll_id = $1 ORDER BY voted_at ASC',
      [pollId]
    );
    res.write(`data: ${JSON.stringify(result.rows)}\n\n`);
  } catch (err) {
    console.error('Failed to fetch initial votes for SSE:', err);
  }

  if (!sseClients.has(pollId)) sseClients.set(pollId, new Set());
  sseClients.get(pollId).add(res);

  req.on('close', () => {
    sseClients.get(pollId)?.delete(res);
  });
});

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.listen(port, () => console.log(`🚀 Poll-service (avec DB) démarré sur le port ${port}`));

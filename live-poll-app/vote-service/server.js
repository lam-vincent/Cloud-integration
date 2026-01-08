const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const app = express();
const port = 3001;

app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const POLL_SERVICE_URL = 'http://poll-service/api/polls';

app.post('/api/vote', async (req, res) => {
  const { pollId, option } = req.body;
  if (!pollId || !option) {
    return res.status(400).send({ error: 'pollId et option sont requis.' });
  }

  try {
    console.log(`Vérification du sondage ${pollId} auprès de poll-service...`);
    const response = await axios.get(`${POLL_SERVICE_URL}/${pollId}`);
    const poll = response.data;
    
    if (!poll.options.includes(option)) {
        return res.status(400).send({ error: `Option non valide.` });
    }
    
    // Insérer le vote dans la base de données
    await pool.query('INSERT INTO votes (poll_id, selected_option) VALUES ($1, $2)', [pollId, option]);
    console.log(`Vote enregistré en BDD pour le sondage ${pollId}`);
    res.status(201).send({ message: 'Vote enregistré avec succès !' });

  } catch (error) {
    console.error("Erreur:", error.message);
    res.status(404).send({ error: 'Le sondage spécifié n\'existe pas.' });
  }
});

app.listen(port, () => console.log(`🚀 Vote-service (avec DB) démarré sur le port ${port}`));
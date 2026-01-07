const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(express.json());

const POLL_SERVICE_URL = 'http://poll-service/api/polls';

app.post('/api/vote', async (req, res) => {
  const { pollId, option } = req.body;
  if (!pollId || !option) {
    return res.status(400).send({ error: 'pollId et option sont requis.' });
  }

  try {
    console.log(`Vérification de l'existence du sondage ${pollId} auprès de poll-service...`);
    const response = await axios.get(`${POLL_SERVICE_URL}/${pollId}`);
    const poll = response.data;
    
    if (!poll.options.includes(option)) {
        console.log(`Option "${option}" non valide pour le sondage ${pollId}`);
        return res.status(400).send({ error: `L'option "${option}" n'est pas valide pour ce sondage.` });
    }
    
    console.log(`Vote reçu pour le sondage ${pollId} ("${poll.question}") sur l'option "${option}"`);
    res.status(200).send({ message: 'Vote enregistré avec succès !' });

  } catch (error) {
    console.error("Erreur lors de la communication avec poll-service:", error.message);
    res.status(404).send({ error: "Le sondage spécifié n'existe pas." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Vote-service démarré sur le port ${port}`);
});
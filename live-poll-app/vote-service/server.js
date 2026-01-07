const express = require('express');
const app = express();
const port = 3001; // Le port interne peut être le même, ils sont dans des conteneurs différents

app.use(express.json());

app.post('/api/vote', (req, res) => {
  const { pollId, option } = req.body;

  if (!pollId || !option) {
    return res.status(400).send({ error: 'pollId et option sont requis.' });
  }

  // Pour l'instant, on affiche juste dans la console
  console.log(`Vote reçu pour le sondage ${pollId} sur l'option "${option}"`);

  res.status(200).send({ message: 'Vote enregistré avec succès !' });
});

app.listen(port, () => {
  console.log(`🚀 Vote-service démarré sur le port ${port}`);
});
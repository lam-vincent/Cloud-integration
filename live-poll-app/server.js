const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());



const polls = [
  { id: 1, question: "Java ou Node.js?", options: ["Java", "Node.js"] },
  { id: 2, question: "Tabs ou Spaces ?", options: ["Tabs", "Spaces"] }
];

app.get('/api/polls', (req, res) => {
  console.log("Requête reçue pour lister tous les sondages");
  res.json(polls);
});

app.get('/api/polls/:id', (req, res) => {
  const pollId = parseInt(req.params.id, 10);
  console.log(`Requête reçue pour le sondage ID: ${pollId}`);
  const poll = polls.find(p => p.id === pollId);

  if (poll) {
    res.json(poll);
  } else {
    res.status(404).send({ error: 'Sondage non trouvé' });
  }
});



app.listen(port, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${port}`);
});
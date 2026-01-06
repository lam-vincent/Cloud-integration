const express = require('express');
const app = express();
const port = 3001;

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

app.get('/', (req, res) => {
  console.log("Requête reçue sur /");
  const polls = [
    { id: 1, question: "Java ou Node.js?", options: ["Java", "Node.js"] }
  ];
  res.json(polls);
});

app.get('/api/polls', (req, res) => {
  const polls = [
    { id: 1, question: "Quel est votre langage préféré ?", options: ["JavaScript", "Python", "Java"] },
    { id: 2, question: "Tabs ou Spaces ?", options: ["Tabs", "Spaces"] }
  ];
  
  res.json(polls);
});

app.listen(port, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${port}`);
});
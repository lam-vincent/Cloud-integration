const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

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
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [polls, setPolls] = useState([]); // État pour stocker les sondages
  const [message, setMessage] = useState("Chargement...");

  useEffect(() => {
    fetch('/api/polls')
      .then(response => {
        if (!response.ok) {
          throw new Error('La réponse du réseau n\'était pas ok');
        }
        return response.json();
      })
      .then(data => {
        setPolls(data);
        setMessage(''); // On efface le message de chargement
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des sondages :", error);
        setMessage("Impossible de charger les sondages depuis l'API.");
      });
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois, au montage du composant

  return (
    <>
      <h1>Plateforme de Vote en Ligne</h1>
      {message && <p>{message}</p>}
      
      <div className="polls-list">
        {polls.map(poll => (
          <div key={poll.id} className="poll-card">
            <h2>{poll.question}</h2>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
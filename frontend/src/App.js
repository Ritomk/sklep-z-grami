import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/hello/')
      .then(res => {
        console.log(res.data);       // DEBUG: zobacz w konsoli
        setMsg(res.data.msg);        // <- użyj dokładnie tej nazwy
      })
      .catch(err => console.error(err));
  }, []);

  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/publishers/')
      .then(res => {
        console.log('Publishers:', res.data); // Debug
        setPublishers(res.data);              // Zapisz do state
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>Dupa {msg}</h1>
    <h1>Lista wydawców</h1>
      <ul>
        {publishers.map(pub => (
          <li key={pub.id}>
            <strong>{pub.name}</strong><br />
            <a href={pub.website} target="_blank" rel="noreferrer">
              {pub.website}
            </a>
          </li>
        ))}
      </ul>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
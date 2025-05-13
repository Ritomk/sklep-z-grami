import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/hello/')
      .then(res => setMsg(res.data.msg))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div className="App">
      <h1>Welcome to the Homepage</h1>
      <p>Message from backend: {msg}</p>
      <button onClick={() => navigate('/new')}>Go to New Page</button>
    </div>
  );
}

export default HomePage;

import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // New state for auto-notif

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      // 1. Show the success message in the UI
      setMessage("✅ Login Successful! Redirecting...");

      // 2. Wait 1.5 seconds, then automatically switch to MoviePage
      setTimeout(() => {
        onLoginSuccess(response.data.username);
      }, 1500);
      
    } catch (err) {
      setMessage("❌ Login failed! Check your credentials.");
      // Clear error message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sign In</h2>
      
      {/* 🔹 The Automatic Notification Pop-up */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" className="btn-primary">Log In</button>
      </form>
    </div>
  );
}

export default Login;
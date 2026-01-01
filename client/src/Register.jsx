import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Ensure this URL matches your server port
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password
      });
      alert(response.data.message);
    } catch (err) {
      alert("Registration failed! Check your browser console (F12) for details.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '0px solid #ccc', borderRadius: '8px', margin: '10px' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
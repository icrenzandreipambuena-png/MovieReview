import { useState } from 'react';
import Register from './Register';
import Login from './Login';
import MoviePage from './MoviePage';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  if (user) {
    return (
      // Removed the nav bar from here
      <MoviePage currentUser={user} onLogout={() => setUser(null)} />
    );
  }

  return (
    <div className="card" style={{ margin: '50px auto', color: '#007bff' }}>
      <h1>Movie Review</h1>
      {view === 'login' ? (
        <>
          <Login onLoginSuccess={(name) => setUser(name)} />
          <button className="link-btn" onClick={() => setView('register')}>
            Don't have an account? Register here
          </button>
        </>
      ) : (
        <>
          <Register />
          <button className="link-btn" onClick={() => setView('login')}>
            Already have an account? Login here
          </button>
        </>
      )}
    </div>
  );
}
export default App;
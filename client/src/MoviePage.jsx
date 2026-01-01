import { useState, useEffect } from 'react';
import axios from 'axios';

function MoviePage({ currentUser, onLogout }) {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', genre: '', director: '', releaseDate: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '', movieId: null });
  const [showWelcome, setShowWelcome] = useState(true);

  const years = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/movies');
      setMovies(res.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { 
    fetchMovies(); 
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const movieData = { ...newMovie, creator: currentUser };
      const res = await axios.post('http://localhost:5000/movies', movieData);
      setMovies(prev => [...prev, res.data]); 
      setNewMovie({ title: '', genre: '', director: '', releaseDate: '' });
    } catch (err) { console.error("Post error:", err); }
  };

  const handleAddReview = async (movieId) => {
    if (reviewForm.rating === 0) return alert("Please select a star rating!");
    
    try {
      const res = await axios.post(`http://localhost:5000/movies/${movieId}/reviews`, { 
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        reviewer: currentUser 
      });
      
      // Update local state with the returned movie object containing the single updated review
      setMovies(prev => prev.map(m => m._id === movieId ? res.data : m));
      setReviewForm({ rating: 0, comment: '', movieId: null }); 
      alert("Review successfully updated!");
    } catch (err) { console.error("Review error:", err); }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm("Delete this movie?")) {
      try {
        await axios.delete(`http://localhost:5000/movies/${movieId}`);
        setMovies(prev => prev.filter(m => m._id !== movieId));
      } catch (err) { console.error("Delete error:", err); }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 800px 260px', gap: '20px', padding: '20px', height: '100vh', overflow: 'hidden', boxSizing: 'border-box', backgroundColor: '#f0f2f5' }}>
      
      {/* COLUMN 1: SIDEBARS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
        
        {/* Created Movies Section */}
        <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', color: '#007bff', borderLeft: '5px solid #007bff', boxShadow: '0 2px 4px rgba(175, 33, 33, 0.05)' }}>
          <h5 style={{ margin: '0 0 10px 0' }}>Created</h5>
          {movies.filter(m => m.creator === currentUser).map(m => (
            <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '5px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</span>
              <button onClick={() => handleDeleteMovie(m._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
          ))}
        </div>

        {/* Reviewed Movies Section (Corrected Edit Logic) */}
        <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', color: '#28a745', borderLeft: '5px solid #28a745', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h5 style={{ margin: '0 0 10px 0' }}>Reviewed</h5>
          {movies.filter(m => m.reviews?.some(r => r.reviewer === currentUser)).map(m => {
            const handleSidebarEdit = () => {
              // Find the latest review data directly from the movie state
              const myLatestReview = m.reviews.find(r => r.reviewer === currentUser);
              if (myLatestReview) {
                setReviewForm({ 
                  rating: myLatestReview.rating, 
                  comment: myLatestReview.comment, 
                  movieId: m._id 
                });
              }
            };

            return (
              <div 
                key={m._id} 
                onClick={handleSidebarEdit}
                style={{ fontSize: '0.75rem', padding: '8px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', color: '#007bff' }}
                title="Click to edit your review"
              >
                <strong>{m.title}</strong> <span style={{fontSize: '10px', color: '#666', float: 'right'}}>✎ Edit</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: MOVIE FEED */}
      <div style={{ position: 'relative', overflowY: 'auto', backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxSizing: 'border-box' }}>
        <h2 style={{ margin: '0 0 25px 0' }}>Movies</h2> 

        {movies.length === 0 ? <p>No movies posted yet...</p> : movies.map(movie => (
          <div key={movie._id} style={{ width: '100%', borderBottom: '2px solid #f8f9fa', paddingBottom: '40px', marginBottom: '40px' }}>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2.5rem' }}>{movie.title}</h1>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '1.1rem' }}>
              <strong>{movie.genre}</strong> | Dir: {movie.director} | {movie.releaseDate}
            </p>
            
            {/* Review List */}
            {movie.reviews?.map((rev, i) => (
              <div key={i} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
                <strong>{rev.reviewer}</strong> <span style={{ color: '#ffc107' }}>{"★".repeat(rev.rating)}</span>
                <p style={{ margin: '5px 0 0 0' }}>{rev.comment}</p>
              </div>
            ))}

            {/* Review Input Box */}
            <div style={{ marginTop: '25px', padding: '20px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#fafafa' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span 
                    key={s} 
                    style={{ cursor: 'pointer', color: s <= (reviewForm.movieId === movie._id ? reviewForm.rating : 0) ? '#ffc107' : '#ddd' }} 
                    onClick={() => setReviewForm({ ...reviewForm, rating: s, movieId: movie._id })}
                  >★</span>
                ))}
              </div>
              <textarea 
                placeholder="What did you think?" 
                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
                value={reviewForm.movieId === movie._id ? reviewForm.comment : ''}
                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value, movieId: movie._id })}
              />
              <button 
                onClick={() => handleAddReview(movie._id)}
                style={{ width: '100%', marginTop: '10px', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {movie.reviews?.some(r => r.reviewer === currentUser) ? "Update My Review" : "Submit Review"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COLUMN 3: REGISTER MOVIE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginTop: 0 }}>➕ Register Movie</h4>
          <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Movie Title" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} required style={{ padding: '10px' }} />
            <input placeholder="Director Name" value={newMovie.director} onChange={e => setNewMovie({...newMovie, director: e.target.value})} required style={{ padding: '10px' }} />
            <select value={newMovie.genre} onChange={e => setNewMovie({...newMovie, genre: e.target.value})} required style={{ padding: '10px' }}>
              <option value="">Select Genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Horror">Horror</option>
            </select>
            <select value={newMovie.releaseDate} onChange={e => setNewMovie({...newMovie, releaseDate: e.target.value})} required style={{ padding: '10px' }}>
              <option value="">Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Post Movie</button>
          </form>
        </div>
        <button onClick={onLogout} style={{ marginTop: 'auto', padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
      </div>
    </div>
  );
}

export default MoviePage;
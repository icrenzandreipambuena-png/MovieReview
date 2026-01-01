const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const movieRoutes = require('./movie'); // router file

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/movie-review-db')
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

// ROUTES
app.use('/movies', movieRoutes); // ALL movie routes are under /movies

// TEST ROUTE
app.get('/', (req, res) => res.send("Server is running"));

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
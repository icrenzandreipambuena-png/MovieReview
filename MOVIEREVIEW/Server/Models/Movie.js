const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  director: { type: String, required: true },
  releaseDate: { type: String, required: true },
  creator: { type: String, required: true },
  reviews: [{ reviewer: String, rating: Number, comment: String }]
});

// Ensure model exists
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

// ✅ GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE movie
router.post('/', async (req, res) => {
  try {
    const { title, genre, director, releaseDate, creator } = req.body;
    const newMovie = new Movie({ title, genre, director, releaseDate, creator, reviews: [] });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ POST review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { reviewer, rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const reviewIndex = movie.reviews.findIndex(r => r.reviewer === reviewer);
    if (reviewIndex > -1) {
      movie.reviews[reviewIndex].rating = rating;
      movie.reviews[reviewIndex].comment = comment;
    } else {
      movie.reviews.push({ reviewer, rating, comment });
    }

    const updatedMovie = await movie.save();
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE movie
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

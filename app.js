// Import required packages and modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express application
const app = express();
app.use(express.json());

// Create a connection to the database
const db = new sqlite3.Database('moviesData.db');

// API 1: Get all movie names
app.get('/movies', (req, res) => {
  db.all('SELECT movie_name FROM movie', (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const movies = rows.map(row => ({ movieName: row.movie_name }));
      res.json(movies);
    }
  });
});

// API 2: Create a new movie
app.post('/movies', (req, res) => {
  const { directorId, movieName, leadActor } = req.body;
  db.run('INSERT INTO movie (director_id, movie_name, lead_actor) VALUES (?, ?, ?)', [directorId, movieName, leadActor], function(err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send('Movie Successfully Added');
    }
  });
});

// API 3: Get movie by ID
app.get('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  db.get('SELECT * FROM movie WHERE movie_id = ?', [movieId], (err, row) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (row) {
      const movie = {
        movieId: row.movie_id,
        directorId: row.director_id,
        movieName: row.movie_name,
        leadActor: row.lead_actor
      };
      res.json(movie);
    } else {
      res.sendStatus(404);
    }
  });
});

// API 4: Update movie details
app.put('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  const { directorId, movieName, leadActor } = req.body;
  db.run('UPDATE movie SET director_id = ?, movie_name = ?, lead_actor = ? WHERE movie_id = ?', [directorId, movieName, leadActor, movieId], function(err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (this.changes > 0) {
      res.send('Movie Details Updated');
    } else {
      res.sendStatus(404);
    }
  });
});

// API 5: Delete a movie
app.delete('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  db.run('DELETE FROM movie WHERE movie_id = ?', [movieId], function(err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (this.changes > 0) {
      res.send('Movie Removed');
    } else {
      res.sendStatus(404);
    }
  });
});

// API 6: Get all directors
app.get('/directors', (req, res) => {
  db.all('SELECT * FROM director', (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const directors = rows.map(row => ({
        directorId: row.director_id,
        directorName: row.director_name
      }));
      res.json(directors);
    }
  });
});

// API 7: Get movies directed by a specific director
app.get('/directors/:directorId/movies', (req, res) => {
  const directorId = req.params.directorId;
  db.all('SELECT movie_name FROM movie WHERE director_id = ?', [directorId], (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const movies = rows.map(row => ({ movieName: row.movie_name }));
      res.json(movies);
    }
  });
});

// Export the Express instance
module.exports = app;

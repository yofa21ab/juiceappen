// app.js
const express = require('express');
const session = require('express-session');
const path = require('path'); // Tilføj denne linje
const app = express();
const port = 80;

// Indstil visningssystemet (EJS)
app.set('view engine', 'ejs');

// Indstil krop-parser for POST-anmodninger
app.use(express.urlencoded({ extended: true }));

// Indstil session middleware
app.use(session({
  secret: 'your-secret-key', // Udskift med en stærk nøgle i produktionsmiljøet
  resave: false,
  saveUninitialized: true
}));

// Angiv Express til at servere statiske filer fra mappen 'billeder'
app.use('/billeder', express.static(path.join(__dirname, 'billeder')));

// Indlæs controller for autentificering
const authController = require('./controllers/authController');
app.use('/', authController);

// En simpel rute til startsiden
app.get('/', (req, res) => {
  res.redirect('/frontpage'); // Omdirigerer brugeren til forsiden
});

// Start serveren
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

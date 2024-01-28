// controllers/authController.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Simuleret database af brugere, ordrer og priser
const users = [];
const orders = [];
const completedOrders = [];

// Middleware til at tjekke om brugeren er logget ind
const isLoggedIn = (req, res, next) => {
  // Simulerer check af brugerens loginstatus
  if (req.session && req.session.user) {
    return next(); // Brugeren er logget ind, gå videre til næste middleware eller rute
  } else {
    res.redirect('/frontpage'); // Brugeren er ikke logget ind, omdiriger til forsiden
  }
};

// Vis forsiden
router.get('/frontpage', (req, res) => {
  res.render('frontpage');
});

// Vis log ind-formularen
router.get('/login', (req, res) => {
  res.render('login');
});

// Behandl log ind-anmodningen
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simulerer en simpel autentificeringslogik
  const user = users.find(user => user.username === username && bcrypt.compareSync(password, user.hashedPassword));

  if (user) {
    // Gem brugeroplysninger i session for at vise, at brugeren er logget ind
    req.session.user = user;
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

// Vis medarbejderlog ind-formularen
router.get('/workerlogin', (req, res) => {
  res.render('workerlogin');
});

// Behandl medarbejderlog ind-anmodningen
router.post('/workerlogin', (req, res) => {
  const { email, password } = req.body;

  // Simulerer en simpel autentificeringslogik for medarbejderlogin
  if (email === 'Younes@joeandthejuice.dk' && password === 'Hej123') {
    req.session.user = { username: 'Younes', role: 'worker' };
    res.redirect('/workerhome');
  } else if (email === 'e' && password === 'e') {
    req.session.user = { username: 'Emil', role: 'worker' };
    res.redirect('/workerhome');
  } else {
    res.redirect('/workerlogin');
  }
});

// Vis medarbejderhjemmesiden
router.get('/workerhome', isLoggedIn, (req, res) => {
  // Hent brugeroplysninger og ordrer fra session og send til visning
  res.render('workerhome', { username: req.session.user.username, orders: req.session.orders });
});

// Behandl tilføjelse til kurv-anmodningen
router.post('/addToCart', isLoggedIn, (req, res) => {
    const { addToCart } = req.body;
    const itemName = req.body[addToCart];
    const itemPrice = getPrice(itemName);
    const cartItem = { name: itemName, price: itemPrice };
  
    req.session.cart = req.session.cart || [];
    req.session.cart.push(cartItem);
  
    res.redirect('/home');
});  

// Behandl bestillingsanmodningen
router.post('/placeOrder', isLoggedIn, (req, res) => {
  const { cart } = req.session;

  // Gem bestillingen i sessionen eller en database af bestillinger
  if (cart && cart.length > 0) {
    const order = { items: cart, username: req.session.user.username };
    req.session.orders = req.session.orders || [];
    req.session.orders.push(order);
    req.session.cart = [];
  }

  res.redirect('/home');
});

// Behandl "Færdig" knap-anmodningen
router.post('/completeOrder', isLoggedIn, (req, res) => {
  const orderId = req.body.orderId;

  // Flyt ordren fra "Tilberedes" til "Klar til afhentning"
  const orderToComplete = req.session.orders[orderId];
  if (orderToComplete) {
    completedOrders.push(orderToComplete);
    req.session.orders.splice(orderId, 1);
  }

  res.redirect('/workerhome');
});

// Vis orderstatus-siden
router.get('/orderstatus', isLoggedIn, (req, res) => {
  res.render('orderstatus', { completedOrders });
});

// Vis registreringsformularen
router.get('/register', (req, res) => {
  res.render('register');
});

// Behandl registreringsanmodningen
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Simulerer oprettelse af en ny bruger med bcrypt-hashing
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { username, hashedPassword };
  users.push(newUser);

  res.redirect('/login');
});

// Vis velkomstside
router.get('/home', isLoggedIn, (req, res) => {
  // Hent brugeroplysninger fra session og send til visning
  res.render('home', { username: req.session.user.username, cart: req.session.cart });
});

// Log ud-rute
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/frontpage');
});

// Hjælpefunktion til at hente pris baseret på produkttype
function getPrice(item) {
    // Simuleret prislogik - tilpas dette baseret på dine produkter og priser
    const prices = {
      'GREEN VEGAN BOWL': 80,
      'JOEs Club': 65,
      'Tunacado': 65,
      'Iron man': 60,
      'Stress Down': 60
    };
  
    return prices[item] || 0;
}
  


module.exports = router;
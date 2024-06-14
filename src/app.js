const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'your-secret-key'; // Replace with your secret key

app.use(bodyParser.json());

// Mock user data (replace with a database in a real application)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // If authentication is successful, generate a JWT token and send it in the response
  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey);
  res.status(201).json({ token });
});

// Middleware to check for a valid JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part from the Bearer scheme

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/profile', authenticateJWT, (req, res) => {
  res.status(201).json({
    message: 'Profile data',
    user: req.user,
  });
});

module.exports = app;

const port = 3000;
app.listen(port, () => {
  console.log(App is listening on port ${port});
});


const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const flatted = require('flatted'); // Import the flatted library
const requestLoggerMiddleware = require('./requestLoggerMiddleware'); // Import the middleware
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Apply the request logger middleware to all routes
app.use(requestLoggerMiddleware);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', (req, res) => {
    const { username, password } = req.body;


    // Simulated SQL Injection vulnerability
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log('Executing query:', query);
    res.send(`Simulated query: ${query}`);
    // res.send(`Submitted username:${username} and password: ${password}`);

});

app.post('/submitxxs', (req, res) => {
    const { username, password } = req.body;
    // Simulated XSS vulnerability
    res.send(`Submitted username: <script>alert('XSS!');</script>${username} and password: ${password}`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

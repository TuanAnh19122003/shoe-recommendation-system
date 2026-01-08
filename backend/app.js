const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


// Test route
app.get('/', (req, res) => {
    res.send('Hello world');
});

module.exports = app;

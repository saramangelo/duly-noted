// require libraries
const express = require('express');
const path = require('path');
const fs = require('fs');

// initialize port
const PORT = 3001;

// initialize app to run express()
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// essentially telling express that anything static comes from the public folder
app.use(express.static('public'));

// GET request

// POST request

// at the bottom - listener ~ app.listen(PORT, () =>)
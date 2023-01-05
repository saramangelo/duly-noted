// require libraries
const express = require('express');
const path = require('path');
const fs = require('fs');
const { addAbortSignal } = require('stream');

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
app.get('/api/notes', (req, res) => {
    // send message to client
    res.json(`${req.method} request received to get notes`);

    // log our request to terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request
app.post('/api/notes', (req, res) => {
    // log that POST request was received
console.info(`${req.method} request received to add notes`);
})

// DELETE request? (bonus)
app.delete(`/api/notes${id}`, (req, res) => {
res.send('DELETE request called');
})

// at the bottom - listener ~ app.listen(PORT, () =>)
app.listen(PORT, () =>
console.log(`App is listening on port ${PORT}!`)
);
// require libraries
const express = require("express");
const path = require("path");
const api = require('./routes/index.js');

// initialize port
const PORT = process.env.PORT || 3001;

// initialize app to run express()
const app = express();

// initialize middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

// set static folder (essentially telling express that anything static comes from the public folder)
app.use(express.static("public"));

// GET /notes ~ should return the notes.html file
app.get("/notes", (req, res) => {
  // send file
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  // log request to terminal
  console.info(`${req.method} request received to get notes html file`);
});

// GET * (wildcard route) ~ should return the index.html file
app.get('*', (req, res) => {
    // send file
    res.sendFile(path.join(__dirname, '/public/index.html'))
    // log request to terminal
    console.info(`${req.method} request received to get index html file`);
})

// at the bottom - listener ~ app.listen(PORT, () =>)
app.listen(PORT, () =>
  console.log(`App is listening on http://localhost:${PORT}`)
);

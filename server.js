// require libraries
const express = require('express');
const path = require('path');
const fs = require('fs');
const { addAbortSignal } = require('stream');

// initialize port
const PORT = 3001;

// initialize app to run express()
const app = express();

// initialize middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
// essentially telling express that anything static comes from the public folder
app.use(express.static('public'));

// GET 
// GET request for API
app.get('/api/notes', (req, res) => {
    // send message to client
    res.json(`${req.method} request received to get notes`);

    // log our request to terminal
    console.info(`${req.method} request received to get notes`);

    // need to read db.json file and return all saved notes as JSON
});

// POST request for API
app.post('/api/notes', (req, res) => {
    // log that POST request was received
console.info(`${req.method} request received to add notes`);

// destructure assignment for items in req.body
const { noteTitle, noteText } = req.body;

// if both properties are present
if (noteTitle && noteText) {
    // variable for object we want to save
    const newNote = {
        noteTitle,
        noteText,
        id: // uuid() ~ need to either install npm uuid package or create file and export like in Day 29, example 19
    };

// convert data to string so we can save it
const noteString = JSON.stringify(newNote);

fs.readFile(`./db/db.json`, "utf-8", (err,data) => {

    // convert string to JSON object
    let noteArr = JSON.parse(noteString);
    // add new note to array
    noteArr.push(newNote);

    // (stringify array) write string to a file 
    fs.writeFile(`./db/db.json`, JSON.stringify(noteArr, null, "\t"), (err) =>
    err
    ? console.error(err)
    : console.log(
        `Note for ${newNote.noteTitle} has been written to JSON file`
    )
    );
})

const response = {
    status: 'success',
    body: newNote,
};

console.log(response);
res.status(201).json(response);
} else {
    res.status(500).json('Error in posting note');
}
});

// DELETE request? (bonus) ~ unsure about path..should it be just '/' instead?
app.delete(`/api/notes${id}`, (req, res) => {
res.send('DELETE request called');
})

// at the bottom - listener ~ app.listen(PORT, () =>)
app.listen(PORT, () =>
console.log(`App is listening on port ${PORT}!`)
);
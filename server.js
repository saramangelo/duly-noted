// require libraries
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uniqid'); // is this correct?
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
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

// GET /notes ~ should return the notes.html file
app.get('/notes', (req, res) => {
    // send message to client
    // res.json(`${req.method} request received to get notes html file`); 
    // send file
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    // log request to terminal
    console.info(`${req.method} request received to get notes html file`);
})

// GET * ~ should return the index.html file
// app.get('*', (req, res) => {
//     // send message to client
//     // res.json(`${req.method} request received to get index html file`); // ?? this feels wrong
//     // send file
//     res.sendFile(path.join(__dirname, '/public/index.html'))
//     // log request to terminal
//     console.info(`${req.method} request received to get index html file`);
// })


// GET request for API
app.get('/api/notes', (req, res) => {
    console.log("here");
    // send message to client
    // res.json(`${req.method} request received to get notes`);

    // log our request to terminal
    console.info(`${req.method} request received to get notes`);

    // need to read db.json file and return all saved notes as JSON
    readFileAsync(`db/db.json`, "utf8").then((data) => {

        // convert string to JSON object
        let noteArr = JSON.parse(data);
        console.log(noteArr)
        res.json(noteArr);

    });
})


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
        id: uuid() // ~ installed npm uuid package, is this all I need?
    };

// obtain existing notes
fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {

    // convert string to JSON object
    let noteArr = JSON.parse(data);
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
    }
});

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
app.delete(`/api/notes`, (req, res) => {
res.send('DELETE request called');
});

// at the bottom - listener ~ app.listen(PORT, () =>)
app.listen(PORT, () =>
console.log(`App is listening on http://localhost:${PORT}`)
);


// Try this? From Day 25, 22-Stu
// // GET Route for retrieving all the tips
// app.get('/api/tips', (req, res) => {
//   console.info(`${req.method} request received for tips`);
//   readFromFile('./db/tips.json').then((data) => res.json(JSON.parse(data)));
// });

// // POST Route for a new UX/UI tip
// app.post('/api/tips', (req, res) => {
//   console.info(`${req.method} request received to add a tip`);

//   const { username, topic, tip } = req.body;

//   if (req.body) {
//     const newTip = {
//       username,
//       tip,
//       topic,
//       tip_id: uuid(),
//     };

//     readAndAppend(newTip, './db/tips.json');
//     res.json(`Tip added successfully 🚀`);
//   } else {
//     res.error('Error in adding tip');
//   }
// });
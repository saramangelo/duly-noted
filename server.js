// require libraries
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uniqid"); // is this correct?
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
// initialize port
const PORT = process.env.port || 3001;

// initialize app to run express()
const app = express();

// initialize middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder (essentially telling express that anything static comes from the public folder)
app.use(express.static("public"));

// GET /notes ~ should return the notes.html file
app.get("/notes", (req, res) => {
  // send message to client
  // res.json(`${req.method} request received to get notes html file`);
  // send file
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  // log request to terminal
  console.info(`${req.method} request received to get notes html file`);
});

// GET request for API
app.get("/api/notes", (req, res) => {
  console.log("here");
  // send message to client
  // res.json(`${req.method} request received to get notes`);

  // log our request to terminal
  console.info(`${req.method} request received to get notes`);

  // need to read db.json file and return all saved notes as JSON
  readFileAsync(`db/db.json`, "utf8").then((data) => {
    // convert string to JSON object
    let noteArr = JSON.parse(data);
    console.log(noteArr);
    res.json(noteArr);
  });
});

// POST request for API
app.post("/api/notes", (req, res) => {
    console.log("you made it");
  // log that POST request was received
  console.info(`${req.method} request received to add notes`);
  console.log(req.body);
  // destructure assignment for items in req.body
  const { title, text } = req.body;

  // if both properties are present
  if (title && text) {
    console.log("if statement");
    // variable for object we want to save
    const newNote = {
      title,
      text,
      id: uuid(), // ~ installed npm uuid package, is this all I need?
    };
    console.log(newNote);
    // obtain existing notes
    fs.readFile("db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log("data:", data);
        // convert string to JSON object
        let noteArr = JSON.parse(data);
        // add new note to array
        noteArr.push(newNote);
        console.log("note array:", noteArr);
        // (stringify array) write string to a file
        fs.writeFile(`db/db.json`, JSON.stringify(noteArr, null, "\t"), (err) =>
          err
            ? console.error(err)
            : console.log(
                `Note for ${newNote.noteTitle} has been written to JSON file`
              )
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

// DELETE request? (bonus) ~ unsure about path..should it be just '/' instead? ~ need to fix this!!
app.delete(`/api/notes/:id`, (req, res) => {
    // add logic to figure out how to remove from the array where the notes id matches the value of that parameter ~ filter functional loop
    //
  res.send("DELETE request called");
});

// GET * (wildcard route) ~ should return the index.html file
app.get('*', (req, res) => {
    // send message to client
    // res.json(`${req.method} request received to get index html file`); // ?? this feels wrong
    // send file
    res.sendFile(path.join(__dirname, '/public/index.html'))
    // log request to terminal
    console.info(`${req.method} request received to get index html file`);
})

// at the bottom - listener ~ app.listen(PORT, () =>)
app.listen(PORT, () =>
  console.log(`App is listening on http://localhost:${PORT}`)
);

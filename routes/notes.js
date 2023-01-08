const notes = require('express').Router();
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const uuid = require("uniqid");
const { response } = require('.');


// GET request for API (/api/notes)
notes.get("/", (req, res) => {
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

  
  // POST request for API (/api/notes)
 notes.post("/", (req, res) => {
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
        id: uuid(), // ~ installed npm uuid package
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

  // *BONUS*
  // delete clicked note
 notes.delete(`/:id`, (req, res) => {
    // add logic to figure out how to remove from the array where the notes id matches the value of that parameter ~ filter functional loop
    fs.readFile("db/db.json", "utf8", (err, data) => {
      
      if (err) {
        console.error(err);
      } else {
        // convert string to JSON object
        let noteArr = JSON.parse(data);
        // note = noteArr[i] (each individual item in array)
        const deletedArr = noteArr.filter(function(note) { 
          if (note.id != req.params.id) { 
            console.log("message")
        return note;
    
          } 
        });
 

        // (stringify array) write string to a file
        fs.writeFile(`db/db.json`, JSON.stringify(deletedArr, null, "\t"), (err) =>
          err
            ? console.error(err)
            : res.json(deletedArr)
        );
      }
    });

  })

  module.exports = notes;
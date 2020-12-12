const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './Develop/public')));

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/db/db.json'));
});

app.get('/api/notes/:id', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json'));
  res.json(savedNotes[Number(req.params.id)]);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.post('/api/notes', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json'));
  let newNote = req.body;
  let id = savedNotes.length.toString();
  newNote.id = id;
  savedNotes.push(newNote);

  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(savedNotes));
  console.log(`Note saved with ID: ${id}`);
  res.json(savedNotes);
});

app.delete('/api/notes/:id', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json'));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteID}`);
  savedNotes = savedNotes.filter(deleteNote => {
    return deleteNote.id != noteID;
  });

  for (deleteNote of savedNotes) {
    deleteNote.id = newID.toString();
    newID++;
  }

  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log(`Now serving port ${PORT}!`);
});

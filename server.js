const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './Develop/public')));

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/db/db.json'));
});

app.get('/api/notes/:id', (req, res) => {
  res.json(savedNotes[Number(req.params.id)]);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const noteId = savedNotes.length.toString();
  newNote.id = noteId;
  savedNotes.push(newNote);

  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(savedNotes));
  console.log(`Note saved with ID: ${noteId}`);
  res.json(savedNotes);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteId}`);
  savedNotes = savedNotes.filter(deleteNote => {
    return deleteNote.id !== noteId;
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

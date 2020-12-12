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

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.post('/api/notes', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json'));
  const newNote = req.body;
  savedNotes.push(newNote);

  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(savedNotes));
  console.log('note saved');
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log(`Now serving port ${PORT}!`);
});

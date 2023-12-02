const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const fs = require('fs');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text ) {
    const newNote = {
      title,
      text
    };
    
    const response = {
      body: newNote,
    };

    res.status(201).json(response);
    fs.appendFile(__dirname + '/db/db.json', JSON.stringify(response, null, 2) + '\n', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Data has been written to the file');
      }
    });
  } else {
    res.status(500).json('Error in saving note');
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
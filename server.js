const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { readFromFile, writeToFile, readAndAppend } = require('./public/assets/helpers/fsUtils');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/notes', async (req, res) => {
  try {
      const data = await readFromFile('./db/db.json');

      if (!data) {
          res.json([]);
          return;
      }

      res.json(JSON.parse(data));
  } catch (error) {
      console.error('Error reading notes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.post('/api/notes', async (req, res) => {
    try {
        console.info(`${req.method} request received to add a note`);
        const { title, text } = req.body;

        if (title && text) {
            const newNote = { title, text };

            const filePath = path.join(__dirname, '/db/db.json');
            const existingNotes = JSON.parse(await fs.readFile(filePath, 'utf-8') || '[]');

            existingNotes.push(newNote);

            await fs.writeFile(filePath, JSON.stringify(existingNotes, null, 2));

            res.status(201).json({ body: newNote });
            console.log('Data has been written to the file');
        } else {
            res.status(400).json({ error: 'Invalid request. Title and text are required.' });
        }
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

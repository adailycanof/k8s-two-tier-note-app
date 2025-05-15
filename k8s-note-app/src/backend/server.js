const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

// In-memory notes storage (would use a database in a real application)
let notes = [
  { id: 1, title: 'Kubernetes Basics', content: 'Learn about pods, services, and deployments', created: new Date() },
  { id: 2, title: 'Docker Tips', content: 'Optimize your container images for production', created: new Date() }
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*'
}));

// Health check endpoint for Kubernetes probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API version info
app.get('/api/info', (req, res) => {
  res.json({
    version: process.env.API_VERSION || 'v1',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString()
  });
});

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Get a single note
app.get('/api/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
    title,
    content,
    created: new Date()
  };
  
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const { title, content } = req.body;
  const noteId = parseInt(req.params.id);
  
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });
  
  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title || notes[noteIndex].title,
    content: content || notes[noteIndex].content,
    updated: new Date()
  };
  
  res.json(notes[noteIndex]);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const initialLength = notes.length;
  
  notes = notes.filter(n => n.id !== noteId);
  
  if (notes.length === initialLength) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Notes API server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
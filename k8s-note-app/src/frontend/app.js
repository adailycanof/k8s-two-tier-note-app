// Configuration
const API_URL = process.env.API_URL || 'http://localhost:8080';
const theme = process.env.THEME_COLOR || 'blue';

// DOM elements
const noteForm = document.getElementById('noteForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const notesList = document.getElementById('notesList');
const apiStatus = document.getElementById('apiStatus');

// Apply theme color if specified
if (theme !== 'blue') {
    document.documentElement.style.setProperty('--primary-color', theme);
}

// Check API status
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_URL}/api/info`);
        if (response.ok) {
            const data = await response.json();
            apiStatus.textContent = `Connected (${data.version}, ${data.environment})`;
            apiStatus.style.color = 'var(--success-color)';
        } else {
            apiStatus.textContent = 'Error connecting to API';
            apiStatus.style.color = 'var(--error-color)';
        }
    } catch (error) {
        console.error('API status check failed:', error);
        apiStatus.textContent = 'Disconnected';
        apiStatus.style.color = 'var(--error-color)';
    }
}

// Fetch all notes
async function fetchNotes() {
    try {
        const response = await fetch(`${API_URL}/api/notes`);
        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        notesList.innerHTML = `<p class="error">Failed to load notes. Please try again later.</p>`;
    }
}

// Display notes in the UI
function displayNotes(notes) {
    if (notes.length === 0) {
        notesList.innerHTML = '<p>No notes yet. Create your first note!</p>';
        return;
    }

    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.dataset.id = note.id;

        const date = new Date(note.created).toLocaleDateString();
        
        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>Created: ${date}</small>
            <div class="note-actions">
                <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
        
        notesList.appendChild(noteCard);
    });
}

// Create a new note
async function createNote(noteData) {
    try {
        const response = await fetch(`${API_URL}/api/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create note');
        }
        
        fetchNotes();
    } catch (error) {
        console.error('Error creating note:', error);
        alert('Failed to create note. Please try again.');
    }
}

// Delete a note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/notes/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete note');
        }
        
        fetchNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
    }
}

// Event listeners
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const noteData = {
        title: titleInput.value,
        content: contentInput.value
    };
    
    createNote(noteData);
    
    // Reset the form
    noteForm.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();
    fetchNotes();
    
    // Check API status periodically
    setInterval(checkApiStatus, 30000);
});
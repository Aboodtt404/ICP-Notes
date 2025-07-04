import { useState, useEffect } from 'react';
import { getNotesBackendActor } from '../declarations/actor';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

const NoteCard = ({ note, onUpdate, onDelete, formatDate, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleUpdate = () => {
    onUpdate(note.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between transition-shadow hover:shadow-lg">
      {isEditing ? (
        <div className="flex flex-col h-full">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2 font-semibold text-xl"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded mb-4 flex-grow"
            rows="5"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:text-gray-700"><X size={20} /></button>
            <button onClick={handleUpdate} className="p-2 text-blue-500 hover:text-blue-700"><Save size={20} /></button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {formatDate(note.updated_at)}
            </span>
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-blue-500" disabled={isLoading}><Edit size={16} /></button>
              <button onClick={() => onDelete(note.id)} className="p-2 text-gray-500 hover:text-red-500" disabled={isLoading}><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [notesBackend, setNotesBackend] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initActor = async () => {
      const actor = await getNotesBackendActor();
      setNotesBackend(actor);
    };
    initActor();
  }, []);

  useEffect(() => {
    if (notesBackend) {
      loadNotes();
    }
  }, [notesBackend]);

  const handleError = (err, message) => {
    console.error(err);
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const loadNotes = async () => {
    if (!notesBackend) return;
    setIsLoading(true);
    try {
      const notesList = await notesBackend.get_all_notes();
      setNotes(notesList.sort((a, b) => Number(b.updated_at) - Number(a.updated_at)));
    } catch (err) {
      handleError(err, "Failed to load notes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!notesBackend) return;
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }
    setIsLoading(true);
    try {
      await notesBackend.add_note(newNoteTitle, newNoteContent);
      setNewNoteTitle('');
      setNewNoteContent('');
      await loadNotes();
    } catch (err) {
      handleError(err, "Failed to add note.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (id, updatedData) => {
    if (!notesBackend) return;
    setIsLoading(true);
    try {
      await notesBackend.update_note(id, updatedData.title, updatedData.content);
      await loadNotes();
    } catch (err) {
       handleError(err, "Failed to update note.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!notesBackend) return;
    if (!confirm('Are you sure you want to delete this note?')) return;
    setIsLoading(true);
    try {
      await notesBackend.delete_note(id);
      await loadNotes();
    } catch (err) {
      handleError(err, "Failed to delete note.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (bigintTimestamp) => {
    const date = new Date(Number(bigintTimestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800">ICP Notes</h1>
          <p className="text-gray-500 mt-2">A Decentralized Note-Taking App</p>
        </header>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6">{error}</p>}
        
        <form onSubmit={handleAddNote} className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Add a New Note</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isLoading}
          >
            <Plus size={20} className="mr-2" />
            {isLoading ? 'Adding Note...' : 'Add Note'}
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && notes.length === 0 ? (
             <p className="text-center text-gray-500 col-span-full">Loading notes...</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard
                key={Number(note.id)}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No notes yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
} 
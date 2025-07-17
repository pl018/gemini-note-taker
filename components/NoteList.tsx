
import React from 'react';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, onSelectNote }) => {
  return (
    <div className="overflow-y-auto h-full bg-background">
      <ul className="p-2 space-y-2">
        {notes.map(note => (
          <li key={note.id}>
            <button
              onClick={() => onSelectNote(note.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                selectedNoteId === note.id
                  ? 'bg-secondary border-accent shadow-md'
                  : 'bg-background border-secondary hover:bg-secondary'
              }`}
            >
              <h3 className="font-medium text-text truncate">{note.title || 'Untitled Note'}</h3>
              <p className="text-caption text-text-secondary truncate mt-1">
                {note.content.substring(0, 60) || 'No content yet...'}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
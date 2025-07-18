
import * as React from 'react';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, onSelectNote }) => {
  return (
    <div className="overflow-y-auto h-full bg-transparent">
      <ul className="p-4 space-y-3">
        {notes.map(note => (
          <li key={note.id}>
            <button
              onClick={() => onSelectNote(note.id)}
              className={`w-full text-left p-4 rounded-md transition-all duration-200 border group ${
                selectedNoteId === note.id
                  ? 'bg-secondary/80 border-accent shadow-lg backdrop-blur-sm ring-2 ring-accent/20'
                  : 'bg-background/30 border-secondary/60 hover:bg-secondary/50 hover:border-secondary backdrop-blur-sm'
              }`}
            >
              <h3 className="font-medium text-text truncate mb-2">{note.title || 'Untitled Note'}</h3>
              <p className="text-caption text-text-secondary truncate leading-relaxed">
                {note.content.substring(0, 80) || 'No content yet...'}
              </p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-neutral/20 text-text-secondary">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
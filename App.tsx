import React, { useState, useEffect, useCallback } from 'react';
import { Note, AiAction, ImprovementOptions, SummarizeOptions, BrainstormOptions } from './types';
import Header from './components/Header';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { runAiAction } from './services/geminiService';
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('gemini-notes');
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    return [
      {
        id: crypto.randomUUID(),
        title: 'Welcome to Gemini Notes!',
        content: 'This is a powerful note-taking app enhanced with AI. Try selecting this note, or create a new one. Use the AI tools in the editor to summarize, improve your writing, or brainstorm ideas.',
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Meeting Agenda',
        content: '- Discuss Q3 sales performance\n- Review marketing campaign results\n- Plan for the upcoming product launch\n- Brainstorm new features for v2.0',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gemini-notes', JSON.stringify(notes));
  }, [notes]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setSelectedNoteId(newNote.id);
    setError(null);
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setError(null);
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, title, content } : note
      )
    );
    setError(null);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => {
      const remainingNotes = prevNotes.filter(note => note.id !== id);
      if (selectedNoteId === id) {
        setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
      return remainingNotes;
    });
    setError(null);
  };
  
  const handleAiAction = useCallback(async (action: AiAction, note: Note, options: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }, saveAsNew: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const textToProcess = action === AiAction.BRAINSTORM ? note.title : note.content;
      if (!textToProcess.trim()) {
        setError(action === AiAction.BRAINSTORM ? 'Please provide a title to brainstorm ideas.' : 'Please provide some content to process.');
        setIsLoading(false);
        return;
      }
      
      const result = await runAiAction(action, textToProcess, options);

      if (saveAsNew) {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: `${note.title} (AI-Generated)`,
          content: result,
          createdAt: new Date().toISOString(),
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setSelectedNoteId(newNote.id);
      } else {
        setNotes(prevNotes =>
          prevNotes.map(n => {
            if (n.id === note.id) {
              if (action === AiAction.SUMMARIZE && options?.summarize && !options.summarize.overwrite) {
                return { ...n, content: result + '\n\n' + n.content };
              }
              return { ...n, content: result };
            }
            return n;
          })
        );
      }
    } catch (err) {
      console.error('AI Action Failed:', err);
      setError('Failed to perform AI action. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div 
      className="flex h-screen font-sans bg-background"
      style={{
        background: theme === 'indigo-purple' ? 'var(--gradient-background)' : undefined
      }}
    >
      <div className="w-1/4 max-w-sm flex flex-col bg-background/80 backdrop-blur-sm border-r border-secondary">
        <Header onNewNote={handleNewNote} />
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
        />
      </div>
      <main className="w-3/4 flex flex-col bg-transparent">
        {selectedNote ? (
          <NoteEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onAiAction={handleAiAction}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-h2 text-text">Select a note or create a new one</h2>
            <p className="text-body text-text-secondary">Your creative space awaits.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
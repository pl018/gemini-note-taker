import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
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
      const parsedNotes = JSON.parse(savedNotes);
      return parsedNotes.map((note: Note) => ({...note, tags: note.tags || []}));
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
  const [search, setSearch] = useState("");
  const [searchByTag, setSearchByTag] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini-notes', JSON.stringify(notes));
  }, [notes]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      tags: [],
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setSelectedNoteId(newNote.id);
    setError(null);
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setError(null);
  };

  const handleUpdateNote = (id: string, title: string, content: string, tags?: string[]) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, title, content, tags: tags ?? note.tags } : note
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
      if (action === AiAction.AUTO_TAG) {
        const result = await runAiAction(action, note.content, {});
        const tags = result.split(',').map(tag => tag.trim()).filter(Boolean);
        setNotes(prevNotes =>
          prevNotes.map(n => 
            n.id === note.id ? { ...n, tags: [...new Set([...n.tags, ...tags])] } : n
          )
        );
        setIsLoading(false);
        return;
      }
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
          tags: note.tags || [],
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

  const filteredNotes = notes.filter(note =>
    searchByTag
      ? (note.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      : note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="flex h-screen font-sans bg-background"
      style={{
        background: theme === 'indigo-purple' ? 'var(--gradient-background)' : undefined
      }}
    >
      <div className="w-1/4 max-w-sm flex flex-col bg-background/80 backdrop-blur-sm border-r border-secondary">
        <Header onNewNote={handleNewNote} />
        <div className="p-4 border-b border-secondary/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-3 pl-10 rounded-md border border-secondary/60 bg-background/50 backdrop-blur-sm text-black placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 hover:border-secondary"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <label className="flex items-center mt-3 text-sm text-text-secondary cursor-pointer hover:text-text transition-colors duration-200">
            <input
              type="checkbox"
              checked={searchByTag}
              onChange={e => setSearchByTag(e.target.checked)}
              className="mr-3 w-4 h-4 text-accent bg-background border-secondary rounded focus:ring-accent focus:ring-2 focus:ring-offset-0"
            />
            Search by tag only
          </label>
        </div>
        <NoteList
          notes={filteredNotes}
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
          <div className="flex flex-col items-center justify-center h-full text-text-secondary p-8">
            <div className="bg-background/30 backdrop-blur-sm border border-secondary/50 rounded-lg p-8 text-center max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-6 mx-auto text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-h3 text-text mb-3">Select a note or create a new one</h2>
              <p className="text-body text-text-secondary leading-relaxed">Your creative space awaits. Start by selecting an existing note or create a new one to begin writing.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
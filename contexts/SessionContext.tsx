import * as React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, Category, AiAction, ImprovementOptions, SummarizeOptions, BrainstormOptions } from '../types';
import { runAiAction } from '../services/geminiService';

// ===== Data Migration =====

interface OldNote {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

function migrateNotesToSessions(notes: OldNote[]): Session[] {
  return notes.map(note => ({
    id: note.id,
    title: note.title,
    content: note.content,
    category: 'idea' as Category,
    status: 'active' as const,
    pinned: false,
    tags: note.tags || [],
    references: [],
    createdAt: note.createdAt,
    updatedAt: note.createdAt,
  }));
}

function loadSessions(): Session[] {
  // Try new format first
  const saved = localStorage.getItem('gemini-sessions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((s: Session) => ({
        ...s,
        category: s.category || 'idea',
        status: s.status || 'active',
        pinned: s.pinned || false,
        tags: s.tags || [],
        references: s.references || [],
        updatedAt: s.updatedAt || s.createdAt,
      }));
    } catch {
      // Fall through to old format
    }
  }

  // Try old format and migrate
  const oldSaved = localStorage.getItem('gemini-notes');
  if (oldSaved) {
    try {
      const oldNotes = JSON.parse(oldSaved);
      const sessions = migrateNotesToSessions(oldNotes);
      // Save in new format
      localStorage.setItem('gemini-sessions', JSON.stringify(sessions));
      return sessions;
    } catch {
      // Fall through to defaults
    }
  }

  // Default sessions
  return [
    {
      id: crypto.randomUUID(),
      title: 'Welcome to Gemini Workspace!',
      content: 'This is a powerful session-based AI workspace. Try selecting this session, or create a new one. Use the AI tools in the editor to summarize, improve your writing, or brainstorm ideas.',
      category: 'idea',
      status: 'active',
      pinned: true,
      tags: ['welcome'],
      references: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Meeting Agenda',
      content: '- Discuss Q3 sales performance\n- Review marketing campaign results\n- Plan for the upcoming product launch\n- Brainstorm new features for v2.0',
      category: 'meeting',
      status: 'active',
      pinned: false,
      tags: ['meeting', 'q3'],
      references: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// ===== Context =====

interface SessionContextType {
  sessions: Session[];
  selectedSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  viewMode: 'active' | 'archived';

  // Session CRUD
  createSession: (category?: Category) => void;
  selectSession: (id: string) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // Session actions
  togglePin: (id: string) => void;
  setCategory: (id: string, category: Category) => void;
  archiveSession: (id: string) => void;
  unarchiveSession: (id: string) => void;
  setViewMode: (mode: 'active' | 'archived') => void;

  // AI actions
  handleAiAction: (action: AiAction, session: Session, options: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }, saveAsNew: boolean) => void;

  // Search
  search: string;
  setSearch: (value: string) => void;
  searchByTag: boolean;
  setSearchByTag: (value: boolean) => void;
  filteredSessions: Session[];

  // Helpers
  selectedSession: Session | undefined;
  getSessionsByCategory: (category: Category) => Session[];
  getPinnedSessions: () => Session[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(() => {
    const loaded = loadSessions();
    const active = loaded.filter(s => s.status === 'active');
    return active.length > 0 ? active[0].id : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchByTag, setSearchByTag] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

  // Persist sessions
  useEffect(() => {
    localStorage.setItem('gemini-sessions', JSON.stringify(sessions));
  }, [sessions]);

  // CRUD
  const createSession = (category: Category = 'idea') => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: 'Untitled Session',
      content: '',
      category,
      status: 'active',
      pinned: false,
      tags: [],
      references: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setSelectedSessionId(newSession.id);
    setError(null);
    if (viewMode === 'archived') setViewMode('active');
  };

  const selectSession = (id: string) => {
    setSelectedSessionId(id);
    setError(null);
  };

  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      )
    );
    setError(null);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (selectedSessionId === id) {
        const active = remaining.filter(s => s.status === viewMode);
        setSelectedSessionId(active.length > 0 ? active[0].id : null);
      }
      return remaining;
    });
    setError(null);
  };

  // Actions
  const togglePin = (id: string) => {
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s)
    );
  };

  const setCategory = (id: string, category: Category) => {
    updateSession(id, { category });
  };

  const archiveSession = (id: string) => {
    updateSession(id, { status: 'archived', pinned: false });
  };

  const unarchiveSession = (id: string) => {
    updateSession(id, { status: 'active' });
  };

  // AI Actions (preserved from original App.tsx logic)
  const handleAiAction = useCallback(async (action: AiAction, session: Session, options: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }, saveAsNew: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const textToProcess = action === AiAction.BRAINSTORM ? session.title : session.content;

      if (action === AiAction.AUTO_TAG) {
        const result = await runAiAction(action, session.content, {});
        const tags = result.split(',').map(tag => tag.trim()).filter(Boolean);
        setSessions(prev =>
          prev.map(s =>
            s.id === session.id ? { ...s, tags: [...new Set([...s.tags, ...tags])], updatedAt: new Date().toISOString() } : s
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
        const newSession: Session = {
          id: crypto.randomUUID(),
          title: `${session.title} (AI-Generated)`,
          content: result,
          category: session.category,
          status: 'active',
          pinned: false,
          tags: session.tags || [],
          references: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSessions(prev => [newSession, ...prev]);
        setSelectedSessionId(newSession.id);
      } else {
        setSessions(prev =>
          prev.map(s => {
            if (s.id === session.id) {
              if (action === AiAction.SUMMARIZE && options?.summarize && !options.summarize.overwrite) {
                return { ...s, content: result + '\n\n' + s.content, updatedAt: new Date().toISOString() };
              }
              return { ...s, content: result, updatedAt: new Date().toISOString() };
            }
            return s;
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

  // Filtered sessions
  const filteredSessions = sessions.filter(s => {
    // Filter by view mode
    if (s.status !== viewMode) return false;

    // Filter by search
    if (!search) return true;
    if (searchByTag) {
      return s.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    }
    return s.title.toLowerCase().includes(search.toLowerCase()) ||
           s.content.toLowerCase().includes(search.toLowerCase());
  });

  // Helpers
  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const getSessionsByCategory = (category: Category) =>
    filteredSessions.filter(s => s.category === category && !s.pinned);

  const getPinnedSessions = () =>
    filteredSessions.filter(s => s.pinned);

  return (
    <SessionContext.Provider value={{
      sessions,
      selectedSessionId,
      isLoading,
      error,
      viewMode,
      createSession,
      selectSession,
      updateSession,
      deleteSession,
      togglePin,
      setCategory,
      archiveSession,
      unarchiveSession,
      setViewMode,
      handleAiAction,
      search,
      setSearch,
      searchByTag,
      setSearchByTag,
      filteredSessions,
      selectedSession,
      getSessionsByCategory,
      getPinnedSessions,
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

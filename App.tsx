import * as React from 'react';
import { CATEGORIES, Category } from './types';
import SidebarHeader from './components/Sidebar/SidebarHeader';
import SearchBar from './components/Sidebar/SearchBar';
import CategoryGroup from './components/Sidebar/CategoryGroup';
import SessionCard from './components/Sidebar/SessionCard';
import ArchiveToggle from './components/Sidebar/ArchiveToggle';
import NoteEditor from './components/NoteEditor';
import { useSession } from './contexts/SessionContext';

const App: React.FC = () => {
  const {
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
    handleAiAction,
    search,
    setSearch,
    searchByTag,
    setSearchByTag,
    filteredSessions,
    selectedSession,
    getSessionsByCategory,
    getPinnedSessions,
    setViewMode,
  } = useSession();

  const activeCount = sessions.filter(s => s.status === 'active').length;
  const archivedCount = sessions.filter(s => s.status === 'archived').length;
  const pinnedSessions = getPinnedSessions();

  // Categories that have sessions
  const categoriesWithSessions = CATEGORIES.filter(cat => getSessionsByCategory(cat).length > 0);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: "'Inter', sans-serif",
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-primary)',
      }}>
        <SidebarHeader onNewNote={() => createSession()} />
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          searchByTag={searchByTag}
          onSearchByTagChange={setSearchByTag}
        />

        {/* Session list */}
        <div className="neo-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {/* Pinned section */}
          {pinnedSessions.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <div style={{
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <svg style={{ width: '10px', height: '10px', color: 'var(--accent-primary)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                </svg>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--accent-primary)',
                }}>
                  Pinned
                </span>
              </div>
              <div style={{ padding: '0 4px' }}>
                {pinnedSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isSelected={selectedSessionId === session.id}
                    onSelect={selectSession}
                    onTogglePin={togglePin}
                    showCategory={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category groups */}
          {categoriesWithSessions.map(category => (
            <CategoryGroup
              key={category}
              category={category}
              sessions={getSessionsByCategory(category)}
              selectedSessionId={selectedSessionId}
              onSelectSession={selectSession}
              onTogglePin={togglePin}
            />
          ))}

          {/* Empty state */}
          {filteredSessions.length === 0 && (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {search ? 'No sessions match your search' : viewMode === 'archived' ? 'No archived sessions' : 'No active sessions'}
              </p>
            </div>
          )}
        </div>

        {/* Archive toggle */}
        <ArchiveToggle
          viewMode={viewMode}
          onToggle={setViewMode}
          activeCount={activeCount}
          archivedCount={archivedCount}
        />
      </div>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedSession ? (
          <NoteEditor
            key={selectedSession.id}
            note={selectedSession}
            onUpdateNote={(id, title, content, tags) => {
              updateSession(id, { title, content, ...(tags ? { tags } : {}) });
            }}
            onDeleteNote={deleteSession}
            onAiAction={handleAiAction}
            isLoading={isLoading}
            error={error}
            onCategoryChange={(cat) => setCategory(selectedSession.id, cat)}
            onArchive={() => archiveSession(selectedSession.id)}
            onUnarchive={() => unarchiveSession(selectedSession.id)}
            onTogglePin={() => togglePin(selectedSession.id)}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '32px',
          }}>
            <div className="card-neo" style={{ textAlign: 'center', maxWidth: '400px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '48px', height: '48px', color: 'var(--accent-primary)', opacity: 0.6, margin: '0 auto 16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '8px' }}>
                No session selected
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Select an existing session or create a new one to begin working.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { PlusIcon } from '../icons/PlusIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import SettingsModal from '../Modals/SettingsModal';

interface SidebarHeaderProps {
  onNewNote: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onNewNote }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--accent-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h1 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
            Gemini Workspace
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="btn-neo btn-neo-icon btn-neo-sm"
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
          <button
            onClick={onNewNote}
            className="btn-neo btn-neo-accent btn-neo-icon btn-neo-sm"
            aria-label="Create new session"
          >
            <PlusIcon />
          </button>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default SidebarHeader;

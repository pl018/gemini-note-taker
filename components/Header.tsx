
import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  onNewNote: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewNote }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="p-4 border-b border-secondary flex justify-between items-center flex-shrink-0 bg-background">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h1 className="text-h4 text-text">Gemini Notes</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center p-2 bg-secondary hover:bg-secondary/80 rounded-md text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
          <button
            onClick={onNewNote}
            className="flex items-center justify-center p-2 bg-accent hover:bg-accent/80 rounded-md text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Create new note"
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

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { TagIcon } from '../icons/TagIcon';
import { SaveIcon } from '../icons/SaveIcon';
import { MicrophoneIcon } from '../icons/MicrophoneIcon';

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'ai' | 'utility';
}

export const SLASH_COMMANDS: SlashCommand[] = [
  { id: 'summarize', label: 'Summarize', description: 'Summarize content', icon: <SparklesIcon className="w-4 h-4" />, category: 'ai' },
  { id: 'improve', label: 'Improve', description: 'Improve writing quality', icon: <SparklesIcon className="w-4 h-4" />, category: 'ai' },
  { id: 'brainstorm', label: 'Brainstorm', description: 'Generate ideas', icon: <LightBulbIcon className="w-4 h-4" />, category: 'ai' },
  { id: 'ask', label: 'Ask', description: 'Ask AI a question', icon: <SparklesIcon className="w-4 h-4" />, category: 'ai' },
  { id: 'auto-tag', label: 'Auto Tag', description: 'Suggest tags via AI', icon: <TagIcon className="w-4 h-4" />, category: 'ai' },
  { id: 'export', label: 'Export', description: 'Export as markdown', icon: <SaveIcon />, category: 'utility' },
  { id: 'dictate', label: 'Dictate', description: 'Start voice input', icon: <MicrophoneIcon />, category: 'utility' },
  { id: 'tag', label: 'Tag', description: 'Add a tag', icon: <TagIcon className="w-4 h-4" />, category: 'utility' },
];

interface SlashCommandMenuProps {
  isOpen: boolean;
  filter: string;
  position: { top: number; left: number };
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ isOpen, filter, position, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = SLASH_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(filter.toLowerCase()) ||
    cmd.description.toLowerCase().includes(filter.toLowerCase())
  );

  const aiCommands = filtered.filter(c => c.category === 'ai');
  const utilityCommands = filtered.filter(c => c.category === 'utility');

  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelect, onClose]);

  if (!isOpen || filtered.length === 0) return null;

  const renderCommand = (cmd: SlashCommand, globalIndex: number) => (
    <button
      key={cmd.id}
      onClick={() => onSelect(cmd)}
      onMouseEnter={() => setSelectedIndex(globalIndex)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        background: selectedIndex === globalIndex ? 'var(--bg-tertiary)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.1s',
        textAlign: 'left',
      }}
    >
      <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>{cmd.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: selectedIndex === globalIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}>
          /{cmd.label}
        </div>
        <div style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          marginTop: '1px',
        }}>
          {cmd.description}
        </div>
      </div>
    </button>
  );

  let globalIndex = 0;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: '260px',
        maxHeight: '320px',
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-hard)',
        zIndex: 100,
        padding: '4px',
      }}
    >
      {aiCommands.length > 0 && (
        <>
          <div style={{
            padding: '6px 12px 4px',
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-tertiary)',
          }}>
            AI Actions
          </div>
          {aiCommands.map(cmd => renderCommand(cmd, globalIndex++))}
        </>
      )}
      {utilityCommands.length > 0 && (
        <>
          <div style={{
            padding: '6px 12px 4px',
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-tertiary)',
            marginTop: aiCommands.length > 0 ? '4px' : 0,
            borderTop: aiCommands.length > 0 ? '1px solid var(--border-primary)' : 'none',
          }}>
            Utilities
          </div>
          {utilityCommands.map(cmd => renderCommand(cmd, globalIndex++))}
        </>
      )}
    </div>
  );
};

export default SlashCommandMenu;

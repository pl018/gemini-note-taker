import React, { useState } from 'react';
import { TagIcon } from '../icons/TagIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Session } from '../../types';

interface TagBarProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onAutoTag: () => void;
  isLoading: boolean;
  references?: string[];
  allSessions?: Session[];
  onSelectSession?: (id: string) => void;
}

const TagBar: React.FC<TagBarProps> = ({ tags, onAddTag, onRemoveTag, onAutoTag, isLoading, references = [], allSessions = [], onSelectSession }) => {
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  // Resolve reference IDs to session titles
  const resolvedRefs = references
    .map(refId => allSessions.find(s => s.id === refId))
    .filter(Boolean) as Session[];

  return (
    <div style={{
      padding: '8px 24px',
      borderTop: '1px solid var(--border-primary)',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      <TagIcon className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />

      {/* Existing tags */}
      {tags.map(tag => (
        <span
          key={tag}
          className="chip-neo"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          {tag}
          <button
            onClick={() => onRemoveTag(tag)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '0 0 0 4px',
              fontSize: '14px',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </span>
      ))}

      {/* Reference chips */}
      {resolvedRefs.map(ref => (
        <span
          key={ref.id}
          className="chip-neo"
          style={{
            background: 'color-mix(in srgb, #3b82f6 12%, transparent)',
            color: '#93c5fd',
            border: '1px solid color-mix(in srgb, #3b82f6 25%, var(--border-primary))',
            cursor: onSelectSession ? 'pointer' : 'default',
          }}
          onClick={() => onSelectSession?.(ref.id)}
          title={`Referenced: ${ref.title}`}
        >
          @{ref.title.length > 15 ? ref.title.substring(0, 15) + '...' : ref.title}
        </span>
      ))}

      {/* Add tag inline */}
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="input-neo"
        style={{
          height: '24px',
          width: '100px',
          fontSize: '10px',
          padding: '0 8px',
          flex: '0 0 auto',
        }}
        placeholder="Add tag..."
      />

      <button
        className="btn-neo btn-neo-ghost btn-neo-sm"
        onClick={onAutoTag}
        disabled={isLoading}
        style={{ height: '24px', fontSize: '9px', padding: '0 8px' }}
      >
        <SparklesIcon className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
        Auto
      </button>
    </div>
  );
};

export default TagBar;

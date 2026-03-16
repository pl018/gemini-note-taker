import * as React from 'react';

interface ArchiveToggleProps {
  viewMode: 'active' | 'archived';
  onToggle: (mode: 'active' | 'archived') => void;
  activeCount: number;
  archivedCount: number;
}

const ArchiveToggle: React.FC<ArchiveToggleProps> = ({ viewMode, onToggle, activeCount, archivedCount }) => {
  return (
    <div style={{
      display: 'flex',
      padding: '8px',
      borderTop: '1px solid var(--border-primary)',
      gap: '4px',
    }}>
      <button
        onClick={() => onToggle('active')}
        style={{
          flex: 1,
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${viewMode === 'active' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
          background: viewMode === 'active'
            ? 'color-mix(in srgb, var(--accent-primary) 10%, var(--bg-secondary))'
            : 'transparent',
          color: viewMode === 'active' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        }}
      >
        Active
        <span style={{
          fontSize: '9px',
          background: viewMode === 'active' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          color: viewMode === 'active' ? 'var(--accent-fg)' : 'var(--text-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 4px',
          fontWeight: 700,
        }}>
          {activeCount}
        </span>
      </button>
      <button
        onClick={() => onToggle('archived')}
        style={{
          flex: 1,
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${viewMode === 'archived' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
          background: viewMode === 'archived'
            ? 'color-mix(in srgb, var(--accent-primary) 10%, var(--bg-secondary))'
            : 'transparent',
          color: viewMode === 'archived' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        }}
      >
        Archive
        <span style={{
          fontSize: '9px',
          background: viewMode === 'archived' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          color: viewMode === 'archived' ? 'var(--accent-fg)' : 'var(--text-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 4px',
          fontWeight: 700,
        }}>
          {archivedCount}
        </span>
      </button>
    </div>
  );
};

export default ArchiveToggle;

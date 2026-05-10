import * as React from 'react';
import { Session, CATEGORY_COLORS } from '../../types';

interface SessionCardProps {
  session: Session;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
  showCategory?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, isSelected, onSelect, onTogglePin, showCategory = false }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(session.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(session.id); }}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'transparent'}`,
        background: isSelected
          ? 'color-mix(in srgb, var(--accent-primary) 10%, var(--bg-secondary))'
          : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'var(--bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      {/* Category dot */}
      {showCategory && (
        <div
          className="cat-dot"
          style={{
            backgroundColor: CATEGORY_COLORS[session.category],
            marginTop: '4px',
            flexShrink: 0,
          }}
        />
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Pin indicator */}
          {session.pinned && (
            <svg style={{ width: '10px', height: '10px', color: 'var(--accent-primary)', flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
            </svg>
          )}
          <h3 style={{
            fontSize: '12px',
            fontWeight: 600,
            color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {session.title || 'Untitled Session'}
          </h3>
        </div>
        <p style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginTop: '2px',
          lineHeight: '1.3',
        }}>
          {session.content.substring(0, 60) || 'No content yet...'}
        </p>
        {/* Tags */}
        {session.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
            {session.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="chip-neo"
                style={{
                  height: '18px',
                  fontSize: '9px',
                  background: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)',
                  color: 'var(--accent-primary)',
                  border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)',
                }}
              >
                {tag}
              </span>
            ))}
            {session.tags.length > 2 && (
              <span className="chip-neo" style={{ height: '18px', fontSize: '9px', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                +{session.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pin toggle on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(session.id);
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: session.pinned ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          opacity: session.pinned ? 1 : 0,
          transition: 'opacity 0.15s',
          padding: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { if (!session.pinned) e.currentTarget.style.opacity = '0'; }}
        title={session.pinned ? 'Unpin' : 'Pin'}
      >
        <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
        </svg>
      </button>
    </div>
  );
};

export default SessionCard;

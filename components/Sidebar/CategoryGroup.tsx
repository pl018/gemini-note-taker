import * as React from 'react';
import { useState } from 'react';
import { Session, Category, CATEGORY_COLORS, CATEGORY_LABELS } from '../../types';
import SessionCard from './SessionCard';

interface CategoryGroupProps {
  category: Category;
  sessions: Session[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  sessions,
  selectedSessionId,
  onSelectSession,
  onTogglePin,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  if (sessions.length === 0) return null;

  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Category header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
      >
        {/* Collapse arrow */}
        <svg
          style={{
            width: '10px',
            height: '10px',
            color: 'var(--text-tertiary)',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
            flexShrink: 0,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>

        {/* Category dot */}
        <div className="cat-dot" style={{ backgroundColor: color }} />

        {/* Label */}
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
          flex: 1,
          textAlign: 'left',
        }}>
          {label}
        </span>

        {/* Count badge */}
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: '1px 6px',
          minWidth: '18px',
          textAlign: 'center',
        }}>
          {sessions.length}
        </span>
      </button>

      {/* Session list */}
      {!isCollapsed && (
        <div style={{ padding: '0 4px' }}>
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              isSelected={selectedSessionId === session.id}
              onSelect={onSelectSession}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGroup;

import React, { useState } from 'react';
import { Category, CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../../types';

interface SessionHeaderProps {
  title: string;
  onTitleChange: (value: string) => void;
  category?: Category;
  onCategoryChange?: (category: Category) => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ title, onTitleChange, category, onCategoryChange }) => {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  return (
    <div style={{
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-primary)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* Category selector */}
      {category && onCategoryChange && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-tertiary)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              height: '28px',
            }}
            title="Change category"
          >
            <div className="cat-dot" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
            }}>
              {CATEGORY_LABELS[category]}
            </span>
            <svg style={{ width: '8px', height: '8px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>

          {/* Dropdown */}
          {showCategoryPicker && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                onClick={() => setShowCategoryPicker(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-hard)',
                zIndex: 50,
                minWidth: '160px',
                padding: '4px',
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      onCategoryChange(cat);
                      setShowCategoryPicker(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: cat === category ? 'var(--bg-tertiary)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={(e) => { if (cat !== category) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="cat-dot" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      color: cat === category ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="SESSION TITLE"
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '0.02em',
        }}
      />
    </div>
  );
};

export default SessionHeader;

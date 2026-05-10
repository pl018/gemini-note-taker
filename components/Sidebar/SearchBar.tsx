import React from 'react';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchByTag: boolean;
  onSearchByTagChange: (value: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange, searchByTag, onSearchByTagChange }) => {
  return (
    <div className="p-3" style={{ borderBottom: '1px solid var(--border-primary)' }}>
      <div className="relative">
        <input
          type="text"
          placeholder="SEARCH SESSIONS..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="input-neo w-full pl-9"
          style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', height: '36px' }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <label
        className="flex items-center gap-2 mt-2 cursor-pointer"
        style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-tertiary)' }}
      >
        <input
          type="checkbox"
          checked={searchByTag}
          onChange={e => onSearchByTagChange(e.target.checked)}
          style={{
            width: '14px',
            height: '14px',
            accentColor: 'var(--accent-primary)',
            cursor: 'pointer',
          }}
        />
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>TAG SEARCH</span>
      </label>
    </div>
  );
};

export default SearchBar;

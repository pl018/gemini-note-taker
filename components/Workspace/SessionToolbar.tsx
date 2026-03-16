import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { MicrophoneIcon } from '../icons/MicrophoneIcon';
import { SaveIcon } from '../icons/SaveIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface SessionToolbarProps {
  isLoading: boolean;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  viewRaw: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  onSummarize: () => void;
  onImprove: () => void;
  onBrainstorm: () => void;
  onToggleView: () => void;
  onDictate: () => void;
  onDownload: () => void;
  onCopyToClipboard?: () => void;
  onDelete: () => void;
  onComplete?: () => void;
  onUnarchive?: () => void;
  onTogglePin?: () => void;
}

const SessionToolbar: React.FC<SessionToolbarProps> = ({
  isLoading,
  isListening,
  hasRecognitionSupport,
  viewRaw,
  isArchived,
  isPinned,
  onSummarize,
  onImprove,
  onBrainstorm,
  onToggleView,
  onDictate,
  onDownload,
  onCopyToClipboard,
  onDelete,
  onComplete,
  onUnarchive,
  onTogglePin,
}) => {
  const disabled = isLoading || isListening;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 24px',
      borderBottom: '1px solid var(--border-primary)',
      background: 'var(--bg-primary)',
      flexWrap: 'wrap',
    }}>
      {/* AI actions */}
      <button className="btn-neo btn-neo-sm" onClick={onSummarize} disabled={disabled} title="Summarize (advanced)">
        <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
        <span>Summarize</span>
      </button>
      <button className="btn-neo btn-neo-sm" onClick={onImprove} disabled={disabled} title="Improve (advanced)">
        <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
        <span>Improve</span>
      </button>
      <button className="btn-neo btn-neo-sm" onClick={onBrainstorm} disabled={disabled} title="Brainstorm (advanced)">
        <LightBulbIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
        <span>Brainstorm</span>
      </button>

      <div style={{ width: '1px', height: '20px', background: 'var(--border-primary)', margin: '0 4px' }} />

      {/* Edit tools */}
      <button className="btn-neo btn-neo-sm" onClick={onToggleView} disabled={disabled}>
        <span>{viewRaw ? 'Preview' : 'Edit'}</span>
      </button>
      <button
        className="btn-neo btn-neo-sm"
        onClick={onDictate}
        disabled={isLoading || !hasRecognitionSupport}
        style={isListening ? {
          background: 'color-mix(in srgb, #ef4444 25%, var(--bg-secondary))',
          borderColor: '#ef4444',
          color: '#fca5a5',
          animation: 'pulse 2s infinite',
        } : undefined}
        title={hasRecognitionSupport ? (isListening ? 'Stop dictation' : 'Start dictation') : 'Not supported'}
      >
        <MicrophoneIcon />
        <span>{isListening ? 'Stop' : 'Dictate'}</span>
      </button>

      <div style={{ flex: 1 }} />

      {/* Session actions */}
      {onTogglePin && (
        <button
          className="btn-neo btn-neo-sm"
          onClick={onTogglePin}
          title={isPinned ? 'Unpin session' : 'Pin session'}
          style={isPinned ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' } : undefined}
        >
          <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
          </svg>
          <span>{isPinned ? 'Pinned' : 'Pin'}</span>
        </button>
      )}

      {/* Complete / Unarchive */}
      {isArchived && onUnarchive ? (
        <button className="btn-neo btn-neo-sm" onClick={onUnarchive} title="Restore to active">
          <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>Restore</span>
        </button>
      ) : onComplete ? (
        <button
          className="btn-neo btn-neo-sm"
          onClick={onComplete}
          disabled={disabled}
          title="Complete and archive session"
          style={{
            borderColor: 'color-mix(in srgb, #10b981 50%, var(--border-primary))',
            color: '#6ee7b7',
          }}
        >
          <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>Complete</span>
        </button>
      ) : null}

      {/* Export */}
      <button className="btn-neo btn-neo-sm" onClick={onDownload} disabled={disabled} title="Export as markdown">
        <SaveIcon />
        <span>Export</span>
      </button>
      {onCopyToClipboard && (
        <button className="btn-neo btn-neo-sm" onClick={onCopyToClipboard} disabled={disabled} title="Copy to clipboard">
          <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>Copy</span>
        </button>
      )}

      {/* Delete */}
      <button className="btn-neo btn-neo-danger btn-neo-sm" onClick={onDelete} disabled={disabled} aria-label="Delete session">
        <TrashIcon />
      </button>
    </div>
  );
};

export default SessionToolbar;

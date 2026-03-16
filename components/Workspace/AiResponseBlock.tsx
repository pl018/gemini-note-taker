import React, { useMemo, useState } from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface AiResponseBlockProps {
  command: string;
  content: string;
  isLoading?: boolean;
  onAccept: () => void;
  onRedo: () => void;
  onDismiss: () => void;
  onFollowUp?: (message: string) => void;
}

const AiResponseBlock: React.FC<AiResponseBlockProps> = ({
  command,
  content,
  isLoading,
  onAccept,
  onRedo,
  onDismiss,
  onFollowUp,
}) => {
  const [followUpText, setFollowUpText] = useState('');
  const previewHtml = useMemo(() => {
    if (!content) return '';
    return DOMPurify.sanitize(marked(content));
  }, [content]);

  const handleFollowUp = () => {
    if (followUpText.trim() && onFollowUp) {
      onFollowUp(followUpText.trim());
      setFollowUpText('');
    }
  };

  return (
    <div style={{
      margin: '12px 24px',
      border: '1px solid color-mix(in srgb, var(--accent-primary) 30%, var(--border-primary))',
      borderRadius: 'var(--radius-md)',
      background: 'color-mix(in srgb, var(--accent-primary) 5%, var(--bg-secondary))',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderBottom: '1px solid color-mix(in srgb, var(--accent-primary) 15%, var(--border-primary))',
        background: 'color-mix(in srgb, var(--accent-primary) 8%, var(--bg-tertiary))',
      }}>
        <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--accent-primary)',
        }}>
          /{command}
        </span>
        {isLoading && (
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid var(--border-secondary)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            marginLeft: 'auto',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px' }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-tertiary)',
            fontSize: '12px',
          }}>
            <span>Generating response...</span>
          </div>
        ) : (
          <div
            className="markdown-preview"
            style={{ fontSize: '13px', lineHeight: '1.6' }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        )}
      </div>

      {/* Follow-up input */}
      {!isLoading && content && onFollowUp && (
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid color-mix(in srgb, var(--accent-primary) 10%, var(--border-primary))',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
              className="input-neo"
              style={{ flex: 1, height: '32px', fontSize: '12px' }}
              placeholder="Follow up... (e.g., 'make it shorter', 'expand on point 2')"
            />
            <button
              className="btn-neo btn-neo-sm"
              onClick={handleFollowUp}
              disabled={!followUpText.trim()}
              style={{ height: '32px' }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isLoading && content && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderTop: '1px solid color-mix(in srgb, var(--accent-primary) 15%, var(--border-primary))',
        }}>
          <button className="btn-neo btn-neo-accent btn-neo-sm" onClick={onAccept} style={{ height: '28px', fontSize: '10px' }}>
            <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
          <button className="btn-neo btn-neo-sm" onClick={onRedo} style={{ height: '28px', fontSize: '10px' }}>
            <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Redo
          </button>
          <button
            className="btn-neo btn-neo-ghost btn-neo-sm"
            onClick={onDismiss}
            style={{ height: '28px', fontSize: '10px', marginLeft: 'auto' }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AiResponseBlock;

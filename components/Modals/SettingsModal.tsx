import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existingKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(existingKey);
      setSaveMessage('');
    }
  }, [isOpen]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setSaveMessage('API key saved successfully!');
    } else {
      localStorage.removeItem('gemini_api_key');
      setSaveMessage('API key removed.');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Settings" description="Manage your Gemini API key for AI features.">
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend className="text-label" style={{ marginBottom: '12px', display: 'block' }}>
          GEMINI API KEY
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="input-neo w-full"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                padding: '4px',
              }}
            >
              {showApiKey ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {apiKey && !showApiKey && (
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
              {maskApiKey(apiKey)}
            </p>
          )}

          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Get your API key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
            >
              Google AI Studio
            </a>
          </p>

          <button className="btn-neo btn-neo-accent btn-neo-sm" onClick={handleSaveApiKey} style={{ alignSelf: 'flex-start' }}>
            Save API Key
          </button>

          {saveMessage && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              background: saveMessage.includes('successfully') || saveMessage.includes('removed')
                ? 'color-mix(in srgb, #10b981 15%, var(--bg-tertiary))'
                : 'color-mix(in srgb, #ef4444 15%, var(--bg-tertiary))',
              color: saveMessage.includes('successfully') || saveMessage.includes('removed')
                ? '#6ee7b7'
                : '#fca5a5',
              border: `1px solid ${saveMessage.includes('successfully') || saveMessage.includes('removed') ? 'color-mix(in srgb, #10b981 30%, var(--border-primary))' : 'color-mix(in srgb, #ef4444 30%, var(--border-primary))'}`,
            }}>
              {saveMessage}
            </div>
          )}
        </div>
      </fieldset>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-neo" onClick={onClose}>
          Close
        </button>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;

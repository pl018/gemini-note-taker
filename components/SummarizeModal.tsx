import React, { useState, useEffect } from 'react';
import { SummarizeOptions } from '../types';
import BaseModal from './Modals/BaseModal';

const strengthLevels = [
  { value: 1, label: 'Quick' },
  { value: 2, label: 'Key Points' },
  { value: 3, label: 'Detailed' },
];

const initialSelections: SummarizeOptions = {
  strength: 2,
  overwrite: false,
};

interface SummarizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedOptions: SummarizeOptions, saveAsNew: boolean) => void;
}

const SummarizeModal: React.FC<SummarizeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selections, setSelections] = useState<SummarizeOptions>(initialSelections);
  const [saveAsNew, setSaveAsNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections);
      setSaveAsNew(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(selections, saveAsNew);
  };

  const strengthDescription = () => {
    switch (selections.strength) {
      case 1: return 'Very short, high-level overview.';
      case 2: return 'Balanced summary of key points.';
      case 3: return 'Comprehensive and detailed summary.';
      default: return '';
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Summarize" description="Adjust the summarization settings.">
      {/* Strength slider */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
        <legend className="text-label" style={{ marginBottom: '12px', display: 'block' }}>Summary Strength</legend>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={selections.strength}
          onChange={(e) => setSelections(prev => ({ ...prev, strength: parseInt(e.target.value, 10) }))}
          style={{
            width: '100%',
            height: '4px',
            appearance: 'none',
            background: 'var(--bg-tertiary)',
            borderRadius: '2px',
            cursor: 'pointer',
            accentColor: 'var(--accent-primary)',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {strengthLevels.map(level => (
            <span key={level.value} style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: selections.strength === level.value ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}>
              {level.label}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>{strengthDescription()}</p>
      </fieldset>

      {/* Overwrite toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-tertiary)',
        cursor: 'pointer',
        marginBottom: '20px',
      }}>
        <input
          type="checkbox"
          checked={selections.overwrite}
          onChange={(e) => setSelections(prev => ({ ...prev, overwrite: e.target.checked }))}
          style={{ display: 'none' }}
        />
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '2px',
          border: `2px solid ${selections.overwrite ? 'var(--accent-primary)' : 'var(--border-secondary)'}`,
          background: selections.overwrite ? 'var(--accent-primary)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {selections.overwrite && <svg style={{ width: '8px', height: '8px', color: 'var(--accent-fg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-primary)' }}>Overwrite existing text</span>
          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>If unchecked, summary will be prepended.</span>
        </div>
      </label>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: saveAsNew ? 'var(--accent-primary)' : 'var(--text-tertiary)',
        }}>
          <input type="checkbox" checked={saveAsNew} onChange={(e) => setSaveAsNew(e.target.checked)} style={{ display: 'none' }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            border: `2px solid ${saveAsNew ? 'var(--accent-primary)' : 'var(--border-secondary)'}`,
            background: saveAsNew ? 'var(--accent-primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {saveAsNew && <svg style={{ width: '8px', height: '8px', color: 'var(--accent-fg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
          </div>
          Save as New
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-neo" onClick={onClose}>Cancel</button>
          <button className="btn-neo btn-neo-accent" onClick={handleConfirm}>Summarize</button>
        </div>
      </div>
    </BaseModal>
  );
};

export default SummarizeModal;

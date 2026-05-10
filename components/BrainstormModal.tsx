import React, { useState, useEffect } from 'react';
import { BrainstormOptions } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { improveCondition } from '../services/geminiService';
import BaseModal from './Modals/BaseModal';

const creativityLevels = [
  { value: 1, label: 'Focused' },
  { value: 2, label: 'Balanced' },
  { value: 3, label: 'Creative' },
  { value: 4, label: 'Wild' },
];

const initialOptions: BrainstormOptions = {
  creativity: 2,
  keywords: '',
  conditions: [],
};

interface BrainstormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: BrainstormOptions, saveAsNew: boolean) => void;
}

const BrainstormModal: React.FC<BrainstormModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [options, setOptions] = useState<BrainstormOptions>(initialOptions);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOptions(initialOptions);
      setSaveAsNew(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(options, saveAsNew);
  };

  const handleAddCondition = () => {
    setOptions(prev => ({ ...prev, conditions: [...prev.conditions, ''] }));
  };

  const handleRemoveCondition = (index: number) => {
    setOptions(prev => ({ ...prev, conditions: prev.conditions.filter((_, i) => i !== index) }));
  };

  const handleConditionChange = (index: number, value: string) => {
    const newConditions = [...options.conditions];
    newConditions[index] = value;
    setOptions(prev => ({ ...prev, conditions: newConditions }));
  };

  const handleImproveCondition = async (index: number) => {
    setImprovingIndex(index);
    try {
      const improved = await improveCondition(options.conditions[index]);
      handleConditionChange(index, improved);
    } catch (error) {
      console.error('Failed to improve condition:', error);
    } finally {
      setImprovingIndex(null);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Brainstorm" description="Fine-tune the AI's creative process." maxWidth="600px">
      {/* Creativity slider */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
        <legend className="text-label" style={{ marginBottom: '12px', display: 'block' }}>Creativity Level</legend>
        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={options.creativity}
          onChange={(e) => setOptions(prev => ({ ...prev, creativity: parseInt(e.target.value, 10) }))}
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
          {creativityLevels.map(level => (
            <span key={level.value} style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: options.creativity === level.value ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}>
              {level.label}
            </span>
          ))}
        </div>
      </fieldset>

      {/* Keywords */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
        <legend className="text-label" style={{ marginBottom: '8px', display: 'block' }}>Keywords & Prompts</legend>
        <textarea
          value={options.keywords}
          onChange={(e) => setOptions(prev => ({ ...prev, keywords: e.target.value }))}
          placeholder="e.g., 'marketing strategies', 'sci-fi plot ideas'"
          className="textarea-neo w-full"
          style={{ minHeight: '80px' }}
        />
      </fieldset>

      {/* Conditions */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <legend className="text-label">Conditions</legend>
          <button
            onClick={handleAddCondition}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: 'var(--accent-primary)',
              padding: '4px',
            }}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {options.conditions.map((condition, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                value={condition}
                onChange={(e) => handleConditionChange(index, e.target.value)}
                placeholder="e.g., 'must be budget-friendly'"
                className="input-neo"
                style={{ flex: 1, height: '36px', fontSize: '12px' }}
              />
              <button
                className="btn-neo btn-neo-ghost btn-neo-icon btn-neo-sm"
                onClick={() => handleImproveCondition(index)}
                disabled={improvingIndex === index}
              >
                {improvingIndex === index ? (
                  <div style={{ width: '14px', height: '14px', border: '2px solid var(--border-secondary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                )}
              </button>
              <button
                className="btn-neo btn-neo-ghost btn-neo-icon btn-neo-sm"
                onClick={() => handleRemoveCondition(index)}
              >
                <TrashIcon className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
              </button>
            </div>
          ))}
        </div>
      </fieldset>

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
          <button className="btn-neo btn-neo-accent" onClick={handleConfirm}>Brainstorm</button>
        </div>
      </div>
    </BaseModal>
  );
};

export default BrainstormModal;

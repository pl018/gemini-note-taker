import React, { useState, useEffect } from 'react';
import { ImprovementOptions } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import BaseModal from './Modals/BaseModal';

const audienceOptions = [
  { value: 'auto', label: 'Let AI Decide' },
  { value: 'general', label: 'General' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'sme', label: 'Expert' },
];

const toneOptions = [
  { value: 'auto', label: 'Let AI Decide' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'persuasive', label: 'Persuasive' },
];

const lengthOptions = [
  { value: 'standard', label: 'No Change' },
  { value: 'shorter', label: 'Shorter' },
  { value: 'longer', label: 'Longer' },
  { value: 'summary', label: 'Summary' },
];

const enhancementOptions = [
  { id: 'fix_grammar', label: 'Fix Grammar' },
  { id: 'clarity', label: 'Improve Clarity' },
  { id: 'simplify', label: 'Simplify' },
  { id: 'lists', label: 'Bullet Points' },
  { id: 'subheads', label: 'Add Headings' },
  { id: 'tldr_top', label: 'Add TL;DR' },
];

const initialSelections: ImprovementOptions = {
  customInstructions: '',
  audience: 'auto',
  tone: 'auto',
  length: 'standard',
  enhancements: {
    fix_grammar: true,
    clarity: false,
    simplify: false,
    lists: false,
    subheads: false,
    tldr_top: false,
  },
};

interface ImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedOptions: ImprovementOptions, saveAsNew: boolean) => void;
  onGeneratePrompt: (draft: string) => Promise<string>;
}

const ImprovementModal: React.FC<ImprovementModalProps> = ({ isOpen, onClose, onConfirm, onGeneratePrompt }) => {
  const [selections, setSelections] = useState<ImprovementOptions>(initialSelections);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections);
      setSaveAsNew(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(selections, saveAsNew);
  };

  const handleAutoGenerate = async () => {
    if (!selections.customInstructions) return;
    setIsGenerating(true);
    try {
      const newPrompt = await onGeneratePrompt(selections.customInstructions);
      setSelections(prev => ({ ...prev, customInstructions: newPrompt }));
    } catch (error) {
      console.error("Error auto-generating prompt:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRadioChange = (category: 'audience' | 'tone' | 'length', value: string) => {
    setSelections(prev => ({ ...prev, [category]: value as any }));
  };

  const handleCheckboxChange = (id: string) => {
    setSelections(prev => ({
      ...prev,
      enhancements: {
        ...prev.enhancements,
        [id]: !prev.enhancements[id as keyof typeof prev.enhancements],
      }
    }));
  };

  const RadioOption = ({ group, value, label }: {group: 'audience' | 'tone' | 'length', value: string, label: string}) => {
    const isChecked = selections[group] === value;
    return (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
        background: isChecked
          ? 'color-mix(in srgb, var(--accent-primary) 10%, var(--bg-tertiary))'
          : 'var(--bg-tertiary)',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.03em',
        color: isChecked ? 'var(--accent-primary)' : 'var(--text-secondary)',
      }}>
        <input type="radio" name={group} value={value} checked={isChecked} onChange={() => handleRadioChange(group, value)} style={{ display: 'none' }} />
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: `2px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-secondary)'}`,
          background: isChecked ? 'var(--accent-primary)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isChecked && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-fg)' }} />}
        </div>
        <span>{label}</span>
      </label>
    );
  };

  const CheckboxOption = ({ id, label }: {id: string, label: string}) => {
    const isChecked = selections.enhancements[id as keyof typeof selections.enhancements];
    return (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
        background: isChecked
          ? 'color-mix(in srgb, var(--accent-primary) 10%, var(--bg-tertiary))'
          : 'var(--bg-tertiary)',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.03em',
        color: isChecked ? 'var(--accent-primary)' : 'var(--text-secondary)',
      }}>
        <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange(id)} style={{ display: 'none' }} />
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '2px',
          border: `2px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-secondary)'}`,
          background: isChecked ? 'var(--accent-primary)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isChecked && <svg style={{ width: '8px', height: '8px', color: 'var(--accent-fg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
        </div>
        <span>{label}</span>
      </label>
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Improve Writing" description="Customize how the AI will refine your text." maxWidth="720px">
      {/* Options grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="text-label" style={{ marginBottom: '8px', display: 'block' }}>Audience</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {audienceOptions.map(opt => <RadioOption key={opt.value} group="audience" {...opt} />)}
          </div>
        </fieldset>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="text-label" style={{ marginBottom: '8px', display: 'block' }}>Tone</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {toneOptions.map(opt => <RadioOption key={opt.value} group="tone" {...opt} />)}
          </div>
        </fieldset>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="text-label" style={{ marginBottom: '8px', display: 'block' }}>Length</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {lengthOptions.map(opt => <RadioOption key={opt.value} group="length" {...opt} />)}
          </div>
        </fieldset>
      </div>

      {/* Enhancements */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
        <legend className="text-label" style={{ marginBottom: '8px', display: 'block' }}>Enhancements</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {enhancementOptions.map(opt => <CheckboxOption key={opt.id} {...opt} />)}
        </div>
      </fieldset>

      {/* Custom instructions */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
        <legend className="text-label" style={{ marginBottom: '8px', display: 'block' }}>Custom Instructions</legend>
        <div style={{ position: 'relative' }}>
          <textarea
            value={selections.customInstructions}
            onChange={(e) => setSelections(prev => ({ ...prev, customInstructions: e.target.value }))}
            placeholder="e.g., 'Translate to French', 'Make it sound more poetic'"
            className="textarea-neo w-full"
            style={{ minHeight: '80px' }}
            disabled={isGenerating}
          />
          {isGenerating && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 9, 11, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ width: '24px', height: '24px', border: '3px solid var(--border-secondary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            </div>
          )}
        </div>
        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleAutoGenerate}
            disabled={!selections.customInstructions || isGenerating}
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
              color: selections.customInstructions && !isGenerating ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              padding: '4px',
            }}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Auto-Generate</span>
          </button>
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
          <button className="btn-neo btn-neo-accent" onClick={handleConfirm}>Improve</button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ImprovementModal;

import React, { useState, useEffect } from 'react';
import { ImprovementOptions } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { useTheme } from '../contexts/ThemeContext';

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
  { id: 'fix_grammar', label: 'Fix Grammar & Spelling' },
  { id: 'clarity', label: 'Improve Clarity / Flow' },
  { id: 'simplify', label: 'Simplify Sentences' },
  { id: 'lists', label: 'Use Bullet Points' },
  { id: 'subheads', label: 'Add Headings' },
  { id: 'tldr_top', label: 'Add TL;DR Summary' },
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
  const { theme } = useTheme();
  const [selections, setSelections] = useState<ImprovementOptions>(initialSelections);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections);
      setSaveAsNew(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
      <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-md border transition-all duration-200 ${
        isChecked 
          ? 'bg-accent/20 border-accent text-text' 
          : 'bg-secondary/50 border-secondary hover:bg-secondary/70 text-text-secondary'
      }`}>
        <input type="radio" name={group} value={value} checked={isChecked} onChange={() => handleRadioChange(group, value)} className="hidden" />
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isChecked ? 'border-accent bg-accent' : 'border-neutral'
        }`}>
          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-background"></div>}
        </div>
        <span className="text-caption">{label}</span>
      </label>
    )
  }

  const CheckboxOption = ({ id, label }: {id: string, label: string}) => {
    const isChecked = selections.enhancements[id as keyof typeof selections.enhancements];
     return (
        <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-md border transition-all duration-200 ${
          isChecked 
            ? 'bg-accent/20 border-accent text-text' 
            : 'bg-secondary/50 border-secondary hover:bg-secondary/70 text-text-secondary'
        }`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleCheckboxChange(id)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              isChecked ? 'border-accent bg-accent' : 'border-neutral'
            }`}>
              {isChecked && <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-caption select-none">{label}</span>
        </label>
     )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
      <div 
        className="border border-secondary rounded-lg shadow-2xl p-8 max-w-3xl w-full transform transition-all m-4"
        style={{
          background: theme === 'indigo-purple' ? 'var(--gradient-modal)' : undefined,
          backdropFilter: theme === 'indigo-purple' ? 'blur(20px)' : undefined
        }}
      >
        <h2 className="text-h2 text-text mb-2">Improve Writing</h2>
        <p className="text-body text-text-secondary mb-6">Customize how the AI will refine your text.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <fieldset>
            <legend className="text-h4 text-text mb-3">Audience</legend>
            <div className="space-y-2">
              {audienceOptions.map(opt => <RadioOption key={opt.value} group="audience" {...opt} />)}
            </div>
          </fieldset>
           <fieldset>
            <legend className="text-h4 text-text mb-3">Tone</legend>
            <div className="space-y-2">
              {toneOptions.map(opt => <RadioOption key={opt.value} group="tone" {...opt} />)}
            </div>
          </fieldset>
           <fieldset>
            <legend className="text-h4 text-text mb-3">Length</legend>
            <div className="space-y-2">
              {lengthOptions.map(opt => <RadioOption key={opt.value} group="length" {...opt} />)}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="text-h4 text-text mb-3">Enhancements</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {enhancementOptions.map(opt => <CheckboxOption key={opt.id} {...opt} />)}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-h4 text-text mb-3">Custom Instructions</legend>
          <div className="relative">
            <textarea
              value={selections.customInstructions}
              onChange={(e) => setSelections(prev => ({ ...prev, customInstructions: e.target.value }))}
              placeholder="e.g., 'Translate to French', 'Make it sound more poetic', 'Explain this to a 5-year-old'"
              className="w-full bg-background border border-secondary rounded-md p-3 text-text focus:ring-2 focus:ring-accent focus:border-accent transition-colors h-28 resize-none placeholder-neutral"
              disabled={isGenerating}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                  <div className="w-8 h-8 border-4 border-t-accent border-r-accent/30 border-b-accent/30 border-l-accent/30 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="mt-2 flex justify-end">
            <button 
              onClick={handleAutoGenerate}
              disabled={!selections.customInstructions || isGenerating}
              className="flex items-center gap-2 text-caption text-accent hover:text-accent/80 disabled:text-neutral disabled:cursor-not-allowed transition-colors"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Auto-Generate Prompt</span>
            </button>
          </div>
        </fieldset>

        <div className="mt-8 flex justify-between items-center">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveAsNew}
              onChange={(e) => setSaveAsNew(e.target.checked)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              saveAsNew ? 'border-accent bg-accent' : 'border-neutral'
            }`}>
              {saveAsNew && <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className={`text-caption select-none ${saveAsNew ? 'text-text' : 'text-text-secondary'}`}>Save as New Note</span>
          </label>
          <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-md text-caption bg-secondary hover:bg-secondary/80 border border-secondary text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 rounded-md text-caption text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            style={{
              background: theme === 'indigo-purple' ? 'var(--gradient-button)' : undefined
            }}
          >
            Improve Text
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ImprovementModal;
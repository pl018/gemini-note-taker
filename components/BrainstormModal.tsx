import React, { useState, useEffect } from 'react';
import { BrainstormOptions } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { improveCondition } from '../services/geminiService';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const [options, setOptions] = useState<BrainstormOptions>(initialOptions);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOptions(initialOptions);
      setSaveAsNew(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
      // Optionally, show an error to the user
    } finally {
      setImprovingIndex(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
      <div 
        className="border border-secondary rounded-lg shadow-2xl p-8 max-w-2xl w-full transform transition-all m-4"
        style={{
          background: theme === 'indigo-purple' ? 'var(--gradient-modal)' : undefined,
          backdropFilter: theme === 'indigo-purple' ? 'blur(20px)' : undefined
        }}
      >
        <h2 className="text-h2 text-text mb-2">Advanced Brainstorming</h2>
        <p className="text-body text-text-secondary mb-6">Fine-tune the AI's creative process to get the best ideas.</p>

        <div className="space-y-6">
          <fieldset>
            <legend className="text-h4 text-text mb-3">Creativity Level</legend>
            <div className="relative pt-2">
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={options.creativity}
                onChange={(e) => setOptions(prev => ({ ...prev, creativity: parseInt(e.target.value, 10) }))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-caption text-text-secondary mt-2">
                {creativityLevels.map(level => <span key={level.value}>{level.label}</span>)}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-h4 text-text mb-3">Keywords & Prompts</legend>
            <textarea
              value={options.keywords}
              onChange={(e) => setOptions(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="e.g., 'marketing strategies for a new coffee shop', 'plot ideas for a sci-fi novel'"
              className="w-full bg-background border border-secondary rounded-md p-3 text-text focus:ring-2 focus:ring-accent focus:border-accent transition-colors h-24 resize-none placeholder-neutral"
            />
          </fieldset>

          <fieldset>
            <div className="flex justify-between items-center mb-3">
              <legend className="text-h4 text-text">Conditions & Constraints</legend>
              <button onClick={handleAddCondition} className="flex items-center gap-2 text-caption text-accent hover:text-accent/80 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>Add Condition</span>
              </button>
            </div>
            <div className="space-y-2">
              {options.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => handleConditionChange(index, e.target.value)}
                    placeholder="e.g., 'must be budget-friendly', 'avoid clichés'"
                    className="w-full bg-background border border-secondary rounded-md p-2 text-text focus:ring-2 focus:ring-accent focus:border-accent transition-colors placeholder-neutral"
                  />
                  <button 
                    onClick={() => handleImproveCondition(index)} 
                    disabled={improvingIndex === index}
                    className="p-2 text-text-secondary hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {improvingIndex === index ? (
                      <svg className="animate-spin h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <SparklesIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button onClick={() => handleRemoveCondition(index)} className="p-2 text-text-secondary hover:text-red-400 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveAsNew}
              onChange={(e) => setSaveAsNew(e.target.checked)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${saveAsNew ? 'border-accent bg-accent' : 'border-neutral'}`}>
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
            Brainstorm Ideas
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BrainstormModal;
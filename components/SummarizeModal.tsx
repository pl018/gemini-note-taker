import React, { useState, useEffect } from 'react';
import { SummarizeOptions } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const strengthLevels = [
  { value: 1, label: 'Quick Overview' },
  { value: 2, label: 'Key Points' },
  { value: 3, label: 'Detailed Summary' },
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
  const { theme } = useTheme();
  const [selections, setSelections] = useState<SummarizeOptions>(initialSelections);
  const [saveAsNew, setSaveAsNew] = useState(false);

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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelections(prev => ({ ...prev, strength: parseInt(e.target.value, 10) }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelections(prev => ({ ...prev, overwrite: e.target.checked }));
  };

  const strengthDescription = () => {
    switch (selections.strength) {
      case 1:
        return 'Generates a very short, high-level summary.';
      case 2:
        return 'Provides a balanced summary of the main points.';
      case 3:
        return 'Creates a more comprehensive and detailed summary.';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
      <div 
        className="border border-secondary rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all m-4"
        style={{
          background: theme === 'indigo-purple' ? 'var(--gradient-modal)' : undefined,
          backdropFilter: theme === 'indigo-purple' ? 'blur(20px)' : undefined
        }}
      >
        <h2 className="text-h2 text-text mb-2">Summarize Note</h2>
        <p className="text-body text-text-secondary mb-6">Adjust the summarization settings.</p>

        <fieldset className="mb-6">
          <legend className="text-h4 text-text mb-3">Summary Strength</legend>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={selections.strength}
              onChange={handleSliderChange}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-caption text-text-secondary mt-2">
            {strengthLevels.map(level => <span key={level.value}>{level.label}</span>)}
          </div>
          <p className="text-caption text-text-secondary mt-3 h-5">{strengthDescription()}</p>
        </fieldset>

        <fieldset>
          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border transition-all duration-200 bg-secondary/50 border-secondary hover:bg-secondary/70">
            <input
              type="checkbox"
              checked={selections.overwrite}
              onChange={handleCheckboxChange}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              selections.overwrite ? 'border-accent bg-accent' : 'border-neutral'
            }`}>
              {selections.overwrite && <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div className="flex flex-col">
                <span className="text-caption select-none text-text">Overwrite existing text</span>
                <span className="text-caption select-none text-text-secondary">If unchecked, summary will be prepended.</span>
            </div>
          </label>
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
            Summarize
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SummarizeModal;
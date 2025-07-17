import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingApi, setIsSavingApi] = useState(false);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [apiSaveMessage, setApiSaveMessage] = useState('');
  const [themeSaveMessage, setThemeSaveMessage] = useState('');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      // Load existing API key from localStorage
      const existingKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(existingKey);
      setApiSaveMessage('');
      setThemeSaveMessage('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSaveApiKey = async () => {
    setIsSavingApi(true);
    try {
      if (apiKey.trim()) {
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setApiSaveMessage('API key saved successfully!');
      } else {
        localStorage.removeItem('gemini_api_key');
        setApiSaveMessage('API key removed.');
      }
      
      setTimeout(() => {
        setApiSaveMessage('');
      }, 3000);
    } catch (error) {
      setApiSaveMessage('Failed to save API key.');
    } finally {
      setIsSavingApi(false);
    }
  };

  const handleSaveTheme = async () => {
    setIsSavingTheme(true);
    try {
      setThemeSaveMessage('Theme saved successfully!');
      
      setTimeout(() => {
        setThemeSaveMessage('');
      }, 3000);
    } catch (error) {
      setThemeSaveMessage('Failed to save theme.');
    } finally {
      setIsSavingTheme(false);
    }
  };

  const handleClose = () => {
    setApiSaveMessage('');
    setThemeSaveMessage('');
    onClose();
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
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
        <h2 className="text-h2 text-text mb-2">Settings</h2>
        <p className="text-body text-text-secondary mb-6">Manage your Gemini API key for AI features.</p>

        <div className="space-y-6">
          <fieldset>
            <legend className="text-h4 text-text mb-3">Gemini API Key</legend>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full bg-background border border-secondary rounded-md p-3 text-text focus:ring-2 focus:ring-accent focus:border-accent transition-colors placeholder-neutral pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
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
                <p className="text-caption text-text-secondary">
                  Current key: {maskApiKey(apiKey)}
                </p>
              )}
              
              <p className="text-caption text-text-secondary">
                Get your API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline"
                >
                  Google AI Studio
                </a>
              </p>
              
              <button
                type="button"
                onClick={handleSaveApiKey}
                disabled={isSavingApi}
                className="mt-3 px-4 py-2 rounded-md text-caption text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: theme === 'indigo-purple' ? 'var(--gradient-button)' : undefined
                }}
              >
                {isSavingApi ? 'Saving...' : 'Save API Key'}
              </button>
              
              {apiSaveMessage && (
                <div className={`mt-2 p-2 rounded-md text-caption ${
                  apiSaveMessage.includes('successfully') || apiSaveMessage.includes('removed')
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                    : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }`}>
                  {apiSaveMessage}
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-h4 text-text mb-3">Theme</legend>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="charcoal-gold"
                  checked={theme === 'charcoal-gold'}
                  onChange={(e) => setTheme(e.target.value as 'charcoal-gold' | 'indigo-purple')}
                  className="w-4 h-4 text-accent bg-background border-secondary focus:ring-accent focus:ring-2"
                />
                <span className="text-body text-text">Charcoal & Gold</span>
                <div className="flex space-x-2 ml-auto">
                  <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-secondary"></div>
                  <div className="w-6 h-6 rounded-full bg-[#FFD700]"></div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="indigo-purple"
                  checked={theme === 'indigo-purple'}
                  onChange={(e) => setTheme(e.target.value as 'charcoal-gold' | 'indigo-purple')}
                  className="w-4 h-4 text-accent bg-background border-secondary focus:ring-accent focus:ring-2"
                />
                <span className="text-body text-text">Indigo & Purple</span>
                <div className="flex space-x-2 ml-auto">
                  <div className="w-6 h-6 rounded-full bg-[#1A1F2E] border border-secondary"></div>
                  <div className="w-6 h-6 rounded-full bg-[#9333EA]"></div>
                </div>
              </label>
            </div>
            
            <button
              type="button"
              onClick={handleSaveTheme}
              disabled={isSavingTheme}
              className="mt-3 px-4 py-2 rounded-md text-caption text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: theme === 'indigo-purple' ? 'var(--gradient-button)' : undefined
              }}
            >
              {isSavingTheme ? 'Saving...' : 'Save Theme'}
            </button>
            
            {themeSaveMessage && (
              <div className={`mt-2 p-2 rounded-md text-caption ${
                themeSaveMessage.includes('successfully')
                  ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                  : 'bg-red-500/20 text-red-200 border border-red-500/30'
              }`}>
                {themeSaveMessage}
              </div>
            )}
          </fieldset>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-md text-caption bg-secondary hover:bg-secondary/80 border border-secondary text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
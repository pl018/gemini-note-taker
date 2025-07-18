import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'charcoal-gold' | 'indigo-purple';

export interface ThemeConfig {
  colors: {
    background: string;
    secondary: string;
    accent: string;
    neutral: string;
    text: string;
    'text-secondary': string;
  };
  gradients?: {
    background?: string;
    button?: string;
    modal?: string;
    download?: string;
  };
}

const themes: Record<Theme, ThemeConfig> = {
  'charcoal-gold': {
    colors: {
      background: '#1A1A1A',
      secondary: '#333333',
      accent: '#FFD700',
      neutral: '#666666',
      text: '#EAEAEA',
      'text-secondary': '#AAAAAA',
    },
    gradients: {},
  },
  'indigo-purple': {
    colors: {
      background: '#1A1F2E',
      secondary: '#2E3440',
      accent: '#9333EA',
      neutral: '#4C566A',
      text: '#EAEAEA',
      'text-secondary': '#D8DEE9',
    },
    gradients: {
      background: 'radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.15) 0%, rgba(79, 70, 229, 0.1) 25%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.1) 0%, rgba(99, 102, 241, 0.08) 25%, transparent 50%), linear-gradient(135deg, #1A1F2E 0%, #16213E 50%, #1A1F2E 100%)',
      button: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(99, 102, 241, 0.9) 100%)',
      download: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.9) 100%)',
      modal: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.05) 0%, transparent 70%), linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(22, 33, 62, 0.98) 100%)',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    return savedTheme || 'indigo-purple';
  });

  const themeConfig = themes[theme];

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    
    // Apply theme colors as CSS variables
    const root = document.documentElement;
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply gradient variables if available
    if (themeConfig.gradients) {
      Object.entries(themeConfig.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--gradient-${key}`, value);
      });
    } else {
      // Clear gradient variables for themes without gradients
      root.style.removeProperty('--gradient-background');
      root.style.removeProperty('--gradient-button');
      root.style.removeProperty('--gradient-modal');
      root.style.removeProperty('--gradient-download');
    }
  }, [theme, themeConfig]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
import * as React from 'react';
import { createContext, useContext } from 'react';

// Neo-brutalist design tokens are defined in styles/neo-brutalist.css
// This context provides access to category colors and theme utilities

export const CATEGORY_COLORS = {
  action: '#f59e0b',
  spec: '#3b82f6',
  architecture: '#8b5cf6',
  ops: '#06b6d4',
  tooling: '#10b981',
  debug: '#ef4444',
  research: '#ec4899',
  reference: '#6366f1',
  meeting: '#14b8a6',
  idea: '#a855f7',
} as const;

export type Category = keyof typeof CATEGORY_COLORS;

interface ThemeContextType {
  getCategoryColor: (category: Category) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getCategoryColor = (category: Category): string => {
    return CATEGORY_COLORS[category] || '#6b7280';
  };

  return (
    <ThemeContext.Provider value={{ getCategoryColor }}>
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

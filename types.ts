// ===== Session Model =====

export type Category = 'action' | 'spec' | 'architecture' | 'ops' | 'tooling' | 'debug' | 'research' | 'reference' | 'meeting' | 'idea';

export const CATEGORIES: Category[] = ['action', 'spec', 'architecture', 'ops', 'tooling', 'debug', 'research', 'reference', 'meeting', 'idea'];

export const CATEGORY_COLORS: Record<Category, string> = {
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
};

export const CATEGORY_LABELS: Record<Category, string> = {
  action: 'Action',
  spec: 'Spec',
  architecture: 'Architecture',
  ops: 'Ops',
  tooling: 'Tooling',
  debug: 'Debug',
  research: 'Research',
  reference: 'Reference',
  meeting: 'Meeting',
  idea: 'Idea',
};

export interface Session {
  id: string;
  title: string;
  content: string;
  category: Category;
  status: 'active' | 'archived';
  pinned: boolean;
  tags: string[];
  references: string[];
  createdAt: string;
  updatedAt: string;
}

// Backwards-compatible alias for components that still use Note
export type Note = Session;

// ===== AI Types =====

export enum AiAction {
  GENERATE_PROMPT = 'generate_prompt',
  SUMMARIZE = 'summarize',
  IMPROVE = 'improve',
  BRAINSTORM = 'brainstorm',
  AUTO_TAG = 'auto_tag'
}

export interface BrainstormOptions {
  creativity: number;
  keywords: string;
  conditions: string[];
}

export interface SummarizeOptions {
  strength: number;
  overwrite: boolean;
}

export interface ImprovementOptions {
  customInstructions?: string;
  audience: 'auto' | 'general' | 'familiar' | 'sme';
  tone: 'auto' | 'neutral' | 'casual' | 'formal' | 'persuasive';
  length: 'auto' | 'shorter' | 'standard' | 'longer' | 'summary';
  enhancements: {
    fix_grammar: boolean;
    clarity: boolean;
    simplify: boolean;
    lists: boolean;
    subheads: boolean;
    tldr_top: boolean;
  };
}

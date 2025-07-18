export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

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

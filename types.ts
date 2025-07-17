export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export enum AiAction {
  GENERATE_PROMPT = 'generate_prompt',
  SUMMARIZE = 'summarize',
    IMPROVE = 'improve',
  BRAINSTORM = 'brainstorm'
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

import { GoogleGenAI } from "@google/genai";
import { AiAction, ImprovementOptions, SummarizeOptions, BrainstormOptions } from '../types';

const getAi = () => {
  const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key not found. Please set it in the settings.");
  }
  return new GoogleGenAI({ apiKey });
};

const getPromptForAction = (action: AiAction, text: string, options?: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }): string => {
  switch (action) {
    case AiAction.SUMMARIZE:
      const strengthMap: { [key: number]: string } = {
        1: 'a very brief, high-level overview.',
        2: 'a concise summary of the key points.',
        3: 'a detailed and comprehensive summary.',
      };
      const strengthDesc = options?.summarize?.strength ? strengthMap[options.summarize.strength] : strengthMap[2];
      return `Summarize the following text, providing ${strengthDesc}. Present the output as a well-organized markdown list.\n\n---\n\n${text}`;
    case AiAction.IMPROVE:
      if (options?.improvement) {
        const instructions: string[] = [];

        // Audience
        if (options.improvement?.audience && options.improvement?.audience !== 'auto') {
          const audienceMap: { [key: string]: string } = {
            general: 'a general audience with no special knowledge.',
            familiar: 'an audience familiar with the topic.',
            sme: 'a subject-matter expert in this field.',
          };
          instructions.push(`- **Target Audience**: Write for ${audienceMap[options.improvement?.audience]}`);
        }

        // Tone
        if (options.improvement?.tone && options.improvement?.tone !== 'auto') {
          const toneMap: { [key: string]: string } = {
            neutral: 'a neutral and objective tone.',
            casual: 'a casual and friendly tone.',
            formal: 'a formal and professional tone.',
            persuasive: 'a persuasive and compelling tone.',
          };
          instructions.push(`- **Tone**: Adopt ${toneMap[options.improvement?.tone]}`);
        }

        // Length
        if (options.improvement?.length && options.improvement?.length !== 'standard') {
           const lengthMap: { [key: string]: string } = {
            shorter: 'Make the text more concise and to the point.',
            longer: 'Expand on the ideas to make the text longer, adding relevant details.',
            summary: 'Condense the text into a brief summary or TL;DR.'
          };
          if(lengthMap[options.improvement?.length]) instructions.push(`- **Length**: ${lengthMap[options.improvement?.length]}`);
        }

        // Enhancements
        const enhancementInstructions: string[] = [];
                if (options.improvement?.enhancements.fix_grammar) enhancementInstructions.push('Fix all spelling and grammar mistakes.');
        if (options.improvement?.enhancements.clarity) enhancementInstructions.push('Improve the overall clarity and flow of the writing.');
        if (options.improvement?.enhancements.simplify) enhancementInstructions.push('Simplify complex sentences and language.');
        if (options.improvement?.enhancements.lists) enhancementInstructions.push('Where appropriate, use bullet or numbered lists to improve scannability.');
        if (options.improvement?.enhancements.subheads) enhancementInstructions.push('Add headings and subheadings to structure the content.');
        if (options.improvement?.enhancements.tldr_top) enhancementInstructions.push('Add a TL;DR summary at the top of the text.');
        
                if (enhancementInstructions.length > 0) {
          instructions.push(`- **Enhancements**:\n  - ${enhancementInstructions.join('\n  - ')}`);
        }

        if (options.improvement.customInstructions) {
          instructions.push(`- **Custom Instructions**: ${options.improvement.customInstructions}`);
        }
        
        if (instructions.length > 0) {
          return `You are an expert writing assistant. Your task is to rewrite the following text based on specific user requests. Do not change the core meaning. Output only the rewritten text.\n\n**Text to improve:**\n"""\n${text}\n"""\n\n**Instructions:**\n${instructions.join('\n')}\n\n**Rewritten Text:**`;
        }
      }
      return `Rewrite the following note to improve its clarity, grammar, and style. Maintain the original meaning but make it more professional and readable:\n\n---\n\n${text}`;
        case AiAction.BRAINSTORM:
      if (options?.brainstorm) {
        const { creativity, keywords, conditions } = options.brainstorm;
        const instructions: string[] = [];

        const creativityMap: { [key: number]: string } = {
          1: 'focused and practical, sticking closely to the core topic.',
          2: 'balanced, exploring related ideas without straying too far.',
          3: 'creative, generating a wide range of diverse and imaginative ideas.',
          4: 'wild and unconventional, pushing the boundaries of the topic.',
        };
        instructions.push(`- **Creativity Level**: Be ${creativityMap[creativity]}`);

        if (keywords) {
          instructions.push(`- **Keywords**: Incorporate the following keywords and concepts: ${keywords}`);
        }

        if (conditions && conditions.length > 0) {
          instructions.push(`- **Conditions**: The ideas must adhere to these constraints:\n  - ${conditions.join('\n  - ')}`);
        }

        return `You are a world-class brainstorming partner. Your goal is to generate a list of creative and relevant ideas based on the provided topic and instructions. Present the output as a well-organized markdown list, using headings and bullet points to structure the ideas.\n\n**Topic:**\n${text}\n\n**Instructions:**\n${instructions.join('\n')}\n\n**Brainstormed Ideas:**`;
      }
      return `Brainstorm a list of ideas based on the following topic. Present the output as a markdown list:\n\n---\n\n${text}`;

    case AiAction.GENERATE_PROMPT:
      return `You are an expert prompt engineer. Your task is to refine the following user-drafted prompt to make it more effective for a large language model. The refined prompt should be clear, concise, and provide sufficient context for the AI to generate a high-quality response. Do not add any preamble or explanation, just the refined prompt.

**User's Draft Prompt:**
${text}

**Refined Prompt:**`;
    case AiAction.AUTO_TAG:
      return `Based on the following note content, suggest 3-5 relevant tags. Return them as a comma-separated list. For example: 'tag1, tag2, tag3'.\n\nContent:\n${text}`;
    default:
      throw new Error('Unknown AI action');
  }
};

export const improveCondition = async (condition: string): Promise<string> => {
  const prompt = getPromptForAction(AiAction.GENERATE_PROMPT, `Improve this brainstorming constraint: "${condition}"`);
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text ?? '';
  } catch (error) {
    console.error(`Error during Gemini API call for improving condition:`, error);
    if (error instanceof Error && error.message.includes("API key not found")) {
        throw error;
    }
    throw new Error('Failed to improve condition via Gemini API.');
  }
};

export const runAiAction = async (action: AiAction, text: string, options?: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }): Promise<string> => {
  const prompt = getPromptForAction(action, text, options);
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text ?? '';
  } catch (error) {
    console.error(`Error during Gemini API call for action "${action}":`, error);
    if (error instanceof Error && error.message.includes("API key not found")) {
        throw error;
    }
    throw new Error('Failed to generate content from Gemini API.');
  }
};
import * as React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AiAction, Note, Category, ImprovementOptions, SummarizeOptions, BrainstormOptions } from '../types';
import { runAiAction } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import SessionHeader from './Workspace/SessionHeader';
import SessionToolbar from './Workspace/SessionToolbar';
import SlashCommandMenu, { SlashCommand } from './Workspace/SlashCommandMenu';
import AiResponseBlock from './Workspace/AiResponseBlock';
import TagBar from './Workspace/TagBar';
import ImprovementModal from './ImprovementModal';
import SummarizeModal from './SummarizeModal';
import BrainstormModal from './BrainstormModal';
import ConfirmDialog from './Modals/ConfirmDialog';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface AiResponse {
  id: string;
  command: string;
  content: string;
  isLoading: boolean;
  context: string; // the text/prompt that was sent
}

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, title: string, content: string, tags?: string[]) => void;
  onDeleteNote: (id: string) => void;
  onAiAction: (action: AiAction, note: Note, options: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }, saveAsNew: boolean) => void;
  isLoading: boolean;
  error: string | null;
  onCategoryChange?: (category: Category) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  onTogglePin?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote, onDeleteNote, onAiAction, isLoading, error, onCategoryChange, onArchive, onUnarchive, onTogglePin }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState(true);
  const [aiResponses, setAiResponses] = useState<AiResponse[]>([]);

  // Modal state (advanced mode via toolbar buttons)
  const [isImproveModalOpen, setIsImproveModalOpen] = useState(false);
  const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState(false);
  const [isBrainstormModalOpen, setBrainstormModalOpen] = useState(false);

  // Slash command state
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const [slashStartIndex, setSlashStartIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const previewHtml = useMemo(() => DOMPurify.sanitize(marked(content)), [content]);

  const handleTranscriptResult = useCallback((transcript: string) => {
    setContent(prev => (prev ? prev + ' ' : '') + transcript);
    setHasChanges(true);
  }, []);

  const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(handleTranscriptResult);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setHasChanges(false);
    setAiResponses([]);
    if (isListening) stopListening();
  }, [note]);

  // Auto-save with debounce
  useEffect(() => {
    if (!hasChanges) return;
    const handler = setTimeout(() => {
      onUpdateNote(note.id, title, content);
      setHasChanges(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [title, content, note.id, onUpdateNote, hasChanges]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContent(value);
    setHasChanges(true);

    // Slash command detection — / at start of a line
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastNewline = textBeforeCursor.lastIndexOf('\n');
    const lineStart = lastNewline + 1;
    const currentLine = textBeforeCursor.substring(lineStart);

    if (currentLine.startsWith('/') && currentLine.length >= 1 && !currentLine.includes(' ')) {
      // Only show menu while typing the command name (no spaces yet)
      const filter = currentLine.substring(1);
      setSlashFilter(filter);
      setSlashStartIndex(lineStart);

      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        const lines = textBeforeCursor.split('\n');
        const lineNumber = lines.length - 1;
        const lineHeight = 22;
        setSlashPosition({
          top: rect.top + Math.min(lineNumber * lineHeight, rect.height - 100) + 30,
          left: rect.left + 24,
        });
      }
      if (!slashMenuOpen) setSlashMenuOpen(true);
    } else if (currentLine.startsWith('/') && currentLine.includes(' ')) {
      // User typed /command something — close the menu, they're entering inline params
      if (slashMenuOpen) setSlashMenuOpen(false);
    } else {
      if (slashMenuOpen) setSlashMenuOpen(false);
    }
  };

  // Handle Enter key to execute inline slash commands
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !slashMenuOpen) {
      const cursorPos = textareaRef.current?.selectionStart || 0;
      const textBeforeCursor = content.substring(0, cursorPos);
      const lastNewline = textBeforeCursor.lastIndexOf('\n');
      const lineStart = lastNewline + 1;
      const currentLine = textBeforeCursor.substring(lineStart);

      // Check if current line is a slash command with content
      const slashMatch = currentLine.match(/^\/(\w+)\s*(.*)/);
      if (slashMatch) {
        e.preventDefault();
        const commandId = slashMatch[1].toLowerCase();
        const inlineText = slashMatch[2].trim();
        executeInlineSlashCommand(commandId, inlineText, lineStart, cursorPos);
      }
    }
  };

  const executeInlineSlashCommand = async (commandId: string, inlineText: string, lineStart: number, lineEnd: number) => {
    // Remove the slash command line from content
    const before = content.substring(0, lineStart);
    const after = content.substring(lineEnd);
    const newContent = (before + after).replace(/\n\n\n+/g, '\n\n').trim();
    setContent(newContent);
    setHasChanges(true);

    // Utility commands
    if (commandId === 'export') { handleDownload(); return; }
    if (commandId === 'dictate') { handleDictateClick(); return; }
    if (commandId === 'tag' && inlineText) {
      handleAddTag(inlineText);
      return;
    }
    if (commandId === 'auto-tag' || commandId === 'autotag') {
      onAiAction(AiAction.AUTO_TAG, { ...note, title, content: newContent }, {}, false);
      return;
    }

    // AI commands — run with inline text as extra context
    await runInlineAiCommand(commandId, inlineText, newContent);
  };

  // Slash menu selection (clicks a command from the popup)
  const handleSlashMenuSelect = async (cmd: SlashCommand) => {
    setSlashMenuOpen(false);

    // Remove the /partial text from content
    if (slashStartIndex >= 0) {
      const cursorPos = textareaRef.current?.selectionStart || content.length;
      const before = content.substring(0, slashStartIndex);
      const after = content.substring(cursorPos);
      const newContent = before + after;
      setContent(newContent);
      setHasChanges(true);
    }

    if (cmd.id === 'export') { handleDownload(); return; }
    if (cmd.id === 'dictate') { handleDictateClick(); return; }
    if (cmd.id === 'auto-tag') {
      onAiAction(AiAction.AUTO_TAG, { ...note, title, content }, {}, false);
      return;
    }
    if (cmd.id === 'tag') { return; } // just clears the slash, user types in tag bar

    await runInlineAiCommand(cmd.id, '', content);
  };

  const runInlineAiCommand = async (commandId: string, inlineText: string, currentContent: string) => {
    const responseId = crypto.randomUUID();
    const contextText = inlineText || currentContent;

    setAiResponses(prev => [...prev, {
      id: responseId,
      command: commandId + (inlineText ? `: ${inlineText}` : ''),
      content: '',
      isLoading: true,
      context: contextText,
    }]);

    try {
      let action: AiAction;
      let textToProcess = contextText;
      const options: any = {};

      switch (commandId) {
        case 'summarize':
          action = AiAction.SUMMARIZE;
          textToProcess = inlineText || currentContent;
          options.summarize = { strength: 2, overwrite: false };
          break;
        case 'improve':
          action = AiAction.IMPROVE;
          textToProcess = inlineText || currentContent;
          options.improvement = {
            audience: 'auto', tone: 'auto', length: 'standard',
            enhancements: { fix_grammar: true, clarity: true, simplify: false, lists: false, subheads: false, tldr_top: false },
            customInstructions: inlineText ? `Focus on: ${inlineText}` : '',
          };
          break;
        case 'brainstorm':
          action = AiAction.BRAINSTORM;
          textToProcess = inlineText || title;
          options.brainstorm = { creativity: 2, keywords: inlineText, conditions: [] };
          break;
        case 'ask':
          // For /ask, use the inline text as a question about the content
          action = AiAction.IMPROVE;
          textToProcess = currentContent;
          options.improvement = {
            audience: 'auto', tone: 'auto', length: 'standard',
            enhancements: { fix_grammar: false, clarity: false, simplify: false, lists: false, subheads: false, tldr_top: false },
            customInstructions: inlineText || 'Answer any questions about this content.',
          };
          break;
        default:
          return;
      }

      const result = await runAiAction(action, textToProcess, options);
      setAiResponses(prev =>
        prev.map(r => r.id === responseId ? { ...r, content: result, isLoading: false } : r)
      );
    } catch {
      setAiResponses(prev =>
        prev.map(r => r.id === responseId ? { ...r, content: 'Error: Failed to generate response. Check your API key.', isLoading: false } : r)
      );
    }
  };

  // Follow-up on an AI response (interactive conversation)
  const handleFollowUp = async (responseId: string, message: string) => {
    const response = aiResponses.find(r => r.id === responseId);
    if (!response) return;

    // Create a new response block for the follow-up
    const newId = crypto.randomUUID();
    setAiResponses(prev => [
      ...prev.map(r => r.id === responseId ? r : r), // keep existing
      {
        id: newId,
        command: `follow-up`,
        content: '',
        isLoading: true,
        context: message,
      }
    ]);

    try {
      // Build context: original content + previous AI response + follow-up question
      const contextPrompt = `Previous content:\n${response.context}\n\nPrevious AI response:\n${response.content}\n\nUser follow-up: ${message}`;
      const result = await runAiAction(AiAction.IMPROVE, contextPrompt, {
        improvement: {
          audience: 'auto', tone: 'auto', length: 'standard',
          enhancements: { fix_grammar: false, clarity: false, simplify: false, lists: false, subheads: false, tldr_top: false },
          customInstructions: message,
        }
      });
      setAiResponses(prev =>
        prev.map(r => r.id === newId ? { ...r, content: result, isLoading: false } : r)
      );
    } catch {
      setAiResponses(prev =>
        prev.map(r => r.id === newId ? { ...r, content: 'Error: Failed to generate follow-up.', isLoading: false } : r)
      );
    }
  };

  const handleAcceptResponse = (responseId: string) => {
    const response = aiResponses.find(r => r.id === responseId);
    if (response) {
      const newContent = content + (content ? '\n\n' : '') + response.content;
      setContent(newContent);
      setHasChanges(true);
      // Force immediate save
      onUpdateNote(note.id, title, newContent);
      setAiResponses(prev => prev.filter(r => r.id !== responseId));
    }
  };

  const handleRedoResponse = async (responseId: string) => {
    const response = aiResponses.find(r => r.id === responseId);
    if (!response) return;

    setAiResponses(prev =>
      prev.map(r => r.id === responseId ? { ...r, isLoading: true, content: '' } : r)
    );

    // Re-extract command id from the command string
    const cmdId = response.command.split(':')[0].trim();
    const inlineText = response.context !== content ? response.context : '';

    try {
      let action: AiAction;
      let textToProcess = content;
      const options: any = {};

      switch (cmdId) {
        case 'summarize':
          action = AiAction.SUMMARIZE;
          options.summarize = { strength: 2, overwrite: false };
          break;
        case 'improve':
          action = AiAction.IMPROVE;
          options.improvement = {
            audience: 'auto', tone: 'auto', length: 'standard',
            enhancements: { fix_grammar: true, clarity: true, simplify: false, lists: false, subheads: false, tldr_top: false },
          };
          break;
        case 'brainstorm':
          action = AiAction.BRAINSTORM;
          textToProcess = inlineText || title;
          options.brainstorm = { creativity: 3, keywords: inlineText, conditions: [] };
          break;
        case 'ask':
        case 'follow-up':
          action = AiAction.IMPROVE;
          options.improvement = {
            audience: 'auto', tone: 'auto', length: 'standard',
            enhancements: { fix_grammar: false, clarity: false, simplify: false, lists: false, subheads: false, tldr_top: false },
            customInstructions: inlineText || response.context,
          };
          break;
        default:
          action = AiAction.IMPROVE;
      }

      const result = await runAiAction(action, textToProcess, options);
      setAiResponses(prev =>
        prev.map(r => r.id === responseId ? { ...r, content: result, isLoading: false } : r)
      );
    } catch {
      setAiResponses(prev =>
        prev.map(r => r.id === responseId ? { ...r, content: 'Error: Failed to regenerate.', isLoading: false } : r)
      );
    }
  };

  const handleDismissResponse = (responseId: string) => {
    setAiResponses(prev => prev.filter(r => r.id !== responseId));
  };

  // Modal confirmations (advanced mode via toolbar)
  const handleGeneratePrompt = async (draft: string) => {
    return await runAiAction(AiAction.GENERATE_PROMPT, draft);
  };

  const handleConfirmImprovement = (options: ImprovementOptions, saveAsNew: boolean) => {
    setIsImproveModalOpen(false);
    onAiAction(AiAction.IMPROVE, { ...note, title, content }, { improvement: options }, saveAsNew);
  };

  const handleConfirmBrainstorm = (options: BrainstormOptions, saveAsNew: boolean) => {
    setBrainstormModalOpen(false);
    onAiAction(AiAction.BRAINSTORM, { ...note, title, content }, { brainstorm: options }, saveAsNew);
  };

  const handleDownload = () => {
    const date = new Date();
    const formattedDate = `${String(date.getFullYear()).slice(-2)}_${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const fileName = `${formattedDate}_${title.replace(/\s+/g, '_')}.md`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDictateClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleAddTag = (tag: string) => {
    const updatedTags = [...new Set([...(note.tags || []), tag])];
    onUpdateNote(note.id, title, content, updatedTags);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = note.tags.filter(t => t !== tagToRemove);
    onUpdateNote(note.id, title, content, updatedTags);
  };

  const handleAutoTag = () => {
    onAiAction(AiAction.AUTO_TAG, { ...note, title, content }, {}, false);
  };

  const anyAiLoading = aiResponses.some(r => r.isLoading);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Session Header */}
      <SessionHeader
        title={title}
        onTitleChange={handleTitleChange}
        category={note.category}
        onCategoryChange={onCategoryChange}
      />

      {/* Toolbar — buttons open advanced modals */}
      <SessionToolbar
        isLoading={isLoading || anyAiLoading}
        isListening={isListening}
        hasRecognitionSupport={hasRecognitionSupport}
        viewRaw={viewRaw}
        isArchived={note.status === 'archived'}
        isPinned={note.pinned}
        onSummarize={() => setIsSummarizeModalOpen(true)}
        onImprove={() => setIsImproveModalOpen(true)}
        onBrainstorm={() => setBrainstormModalOpen(true)}
        onToggleView={() => setViewRaw(v => !v)}
        onDictate={handleDictateClick}
        onDownload={handleDownload}
        onCopyToClipboard={() => navigator.clipboard.writeText(content)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onComplete={onArchive}
        onUnarchive={onUnarchive}
        onTogglePin={onTogglePin}
      />

      {/* Error */}
      {error && (
        <div style={{
          margin: '12px 24px 0',
          padding: '10px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid color-mix(in srgb, #ef4444 30%, var(--border-primary))',
          background: 'color-mix(in srgb, #ef4444 10%, var(--bg-secondary))',
          color: '#fca5a5',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}>
          {error}
        </div>
      )}

      {/* Content area */}
      <div className="neo-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {viewRaw ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="textarea-neo"
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '24px',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              resize: 'none',
              fontSize: '14px',
              lineHeight: '1.6',
              boxShadow: 'none',
            }}
            placeholder="Start writing, or type / for commands...&#10;&#10;Try: /ask what should I focus on?&#10;      /summarize&#10;      /brainstorm marketing ideas"
          />
        ) : (
          <div
            className="markdown-preview"
            style={{ padding: '24px' }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        )}

        {/* Inline AI Response Blocks */}
        {aiResponses.map(response => (
          <AiResponseBlock
            key={response.id}
            command={response.command}
            content={response.content}
            isLoading={response.isLoading}
            onAccept={() => handleAcceptResponse(response.id)}
            onRedo={() => handleRedoResponse(response.id)}
            onDismiss={() => handleDismissResponse(response.id)}
            onFollowUp={(msg) => handleFollowUp(response.id, msg)}
          />
        ))}
      </div>

      {/* Slash Command Menu */}
      <SlashCommandMenu
        isOpen={slashMenuOpen}
        filter={slashFilter}
        position={slashPosition}
        onSelect={handleSlashMenuSelect}
        onClose={() => setSlashMenuOpen(false)}
      />

      {/* Tag Bar */}
      <TagBar
        tags={note.tags || []}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onAutoTag={handleAutoTag}
        isLoading={isLoading || anyAiLoading}
        references={note.references || []}
      />

      {/* Advanced Mode Modals (toolbar buttons) */}
      <ImprovementModal
        onGeneratePrompt={handleGeneratePrompt}
        isOpen={isImproveModalOpen}
        onClose={() => setIsImproveModalOpen(false)}
        onConfirm={handleConfirmImprovement}
      />
      <SummarizeModal
        isOpen={isSummarizeModalOpen}
        onClose={() => setIsSummarizeModalOpen(false)}
        onConfirm={(options: SummarizeOptions, saveAsNew: boolean) => {
          setIsSummarizeModalOpen(false);
          onAiAction(AiAction.SUMMARIZE, { ...note, title, content }, { summarize: options }, saveAsNew);
        }}
      />
      <BrainstormModal
        isOpen={isBrainstormModalOpen}
        onClose={() => setBrainstormModalOpen(false)}
        onConfirm={handleConfirmBrainstorm}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => onDeleteNote(note.id)}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
      />
    </div>
  );
};

export default NoteEditor;

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AiAction, Note, ImprovementOptions, SummarizeOptions, BrainstormOptions } from '../types';
import { runAiAction } from '../services/geminiService';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import ImprovementModal from './ImprovementModal';
import SummarizeModal from './SummarizeModal';
import BrainstormModal from './BrainstormModal';
import TagManager from './TagManager';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, title: string, content: string, tags?: string[]) => void;
  onDeleteNote: (id: string) => void;
  onAiAction: (action: AiAction, note: Note, options: { improvement?: ImprovementOptions, summarize?: SummarizeOptions, brainstorm?: BrainstormOptions }, saveAsNew: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote, onDeleteNote, onAiAction, isLoading, error }) => {
  const handleGeneratePrompt = async (draft: string) => {
    // This is a bit of a hack, as we're re-using the AI action handler for something that doesn't directly update the note.
    // In a larger app, we might have a separate service for this.
    const newPrompt = await runAiAction(AiAction.GENERATE_PROMPT, draft);
    return newPrompt;
  };
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [hasChanges, setHasChanges] = useState(false);
  const [isImproveModalOpen, setIsImproveModalOpen] = useState(false);
  const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState(false);
  const [isBrainstormModalOpen, setBrainstormModalOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState(true);
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
    if(isListening) {
      stopListening();
    }
  }, [note]);

  useEffect(() => {
    if (!hasChanges) return;
    const handler = setTimeout(() => {
      onUpdateNote(note.id, title, content);
      setHasChanges(false);
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, note.id, onUpdateNote, hasChanges]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
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
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleConfirmBrainstorm = (options: BrainstormOptions, saveAsNew: boolean) => {
    setBrainstormModalOpen(false);
    onAiAction(AiAction.BRAINSTORM, { ...note, title, content }, { brainstorm: options }, saveAsNew);
  };

  const handleConfirmImprovement = (options: ImprovementOptions, saveAsNew: boolean) => {
    setIsImproveModalOpen(false);
    onAiAction(AiAction.IMPROVE, { ...note, title, content }, { improvement: options }, saveAsNew);
  };

// Removed unused handleUpdateTags

  return (
    <div className="flex flex-col h-full bg-background">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <SparklesIcon className="w-12 h-12 text-accent animate-pulse" />
            <p className="text-body text-text mt-4">Gemini is thinking...</p>
          </div>
        </div>
      )}
      <div className="p-6 border-b border-secondary/50 flex justify-between items-center flex-shrink-0 bg-background/50 backdrop-blur-sm">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-h2 bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text w-full placeholder-text-secondary mr-4 py-2 px-1 rounded-md transition-all duration-200"
          placeholder="Note Title"
        />
        <div className="flex items-center space-x-3 flex-shrink-0">
           <button
            onClick={() => setIsSummarizeModalOpen(true)}
            disabled={isLoading || isListening}
            className="flex items-center space-x-2 px-3 py-2 bg-secondary hover:bg-secondary/80 border border-secondary hover:border-neutral rounded-md text-caption text-text transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            title="Summarize Note"
          >
            <SparklesIcon className="w-4 h-4 text-accent" />
            <span>Summarize</span>
          </button>
           <button
            onClick={() => setIsImproveModalOpen(true)}
            disabled={isLoading || isListening}
            className="flex items-center space-x-2 px-3 py-2 bg-secondary hover:bg-secondary/80 border border-secondary hover:border-neutral rounded-md text-caption text-text transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            title="Improve Writing"
          >
            <SparklesIcon className="w-4 h-4 text-accent" />
            <span>Improve</span>
          </button>
          <button
            onClick={() => setBrainstormModalOpen(true)}
            disabled={isLoading || isListening}
            className="flex items-center space-x-2 px-3 py-2 bg-secondary hover:bg-secondary/80 border border-secondary hover:border-neutral rounded-md text-caption text-text transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            title="Brainstorm Ideas"
          >
            <LightBulbIcon className="w-4 h-4 text-accent" />
            <span>Brainstorm</span>
          </button>
          <button
            onClick={() => setViewRaw(v => !v)}
            disabled={isLoading || isListening}
            className="flex items-center space-x-2 px-3 py-2 bg-secondary hover:bg-secondary/80 border border-secondary hover:border-neutral rounded-md text-caption text-text transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            title={viewRaw ? 'Show Preview' : 'Edit Markdown'}
          >
            <span>{viewRaw ? 'Preview' : 'Edit'}</span>
          </button>
          <button
            onClick={handleDictateClick}
            disabled={isLoading || !hasRecognitionSupport}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-caption transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border focus:outline-none focus:ring-2 focus:ring-accent ${
              isListening
                ? 'bg-red-500/80 border-red-400 text-white animate-pulse'
                : 'bg-secondary hover:bg-secondary/80 border-secondary hover:border-neutral text-text'
            }`}
            title={hasRecognitionSupport ? (isListening ? 'Stop dictation' : 'Start dictation') : 'Dictation not supported in your browser'}
          >
            <MicrophoneIcon />
            <span>{isListening ? 'Listening...' : 'Dictate'}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading || isListening}
            className="p-2 rounded-md text-white transition-all duration-200 disabled:bg-neutral disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            style={{
              background: 'var(--gradient-download)',
              opacity: isLoading || isListening ? 0.5 : 1
            }}
            aria-label="Download note"
          >
            <SaveIcon />
          </button>
          <button
            onClick={() => onDeleteNote(note.id)}
            disabled={isLoading || isListening}
            className="p-2 bg-red-800/50 hover:bg-red-700/70 border border-red-700/50 hover:border-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete note"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      {error && <div className="p-4 bg-red-500/20 text-red-200 border-l-4 border-red-400 mx-6 my-4 rounded-md">{error}</div>}
      {viewRaw ? (
        <textarea
          value={content}
          onChange={handleContentChange}
          className="flex-grow w-full p-6 bg-transparent text-text focus:outline-none resize-none text-body leading-relaxed placeholder-text-secondary"
          placeholder="Start writing your note here, or try dictating!"
        />
      ) : (
        <div
          className="markdown-preview flex-grow w-full p-6 overflow-y-auto text-text"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}
              <ImprovementModal
          onGeneratePrompt={handleGeneratePrompt}
        isOpen={isImproveModalOpen}
        onClose={() => setIsImproveModalOpen(false)}
        onConfirm={handleConfirmImprovement}
      />
      <TagManager 
        note={note} 
        onUpdateNote={(id, title, content, tags) => onUpdateNote(id, title, content, tags)} 
        onAiAction={onAiAction} 
        isLoading={isLoading} 
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
    </div>
  );
};

export default NoteEditor;
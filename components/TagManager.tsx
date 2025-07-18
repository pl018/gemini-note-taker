import * as React from 'react';
import { useState } from 'react';
import { Note, AiAction } from '../types';
import { TagIcon } from './icons/TagIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface TagManagerProps {
  note: Note;
  onUpdateNote: (id: string, title: string, content: string, tags: string[]) => void;
  onAiAction: (action: AiAction, note: Note, options: {}, saveAsNew: boolean) => void;
  isLoading: boolean;
}

const TagManager: React.FC<TagManagerProps> = ({ note, onUpdateNote, onAiAction, isLoading }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !(note.tags || []).includes(newTag.trim())) {
      const updatedTags = [...(note.tags || []), newTag.trim()];
      onUpdateNote(note.id, note.title, note.content, updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = note.tags.filter(tag => tag !== tagToRemove);
    onUpdateNote(note.id, note.title, note.content, updatedTags);
  };

  const handleAutoTag = () => {
    onAiAction(AiAction.AUTO_TAG, note, {}, false);
  };

  return (
    <div className="p-4 border-t border-secondary">
      <div className="flex items-center mb-2">
        <TagIcon className="w-5 h-5 mr-2 text-text-secondary" />
        <h3 className="text-h3 text-text">Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(note.tags || []).map(tag => (
          <div key={tag} className="flex items-center bg-secondary rounded-full px-3 py-1 text-caption text-text">
            <span>{tag}</span>
            <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-text-secondary hover:text-text focus:outline-none">
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          className="flex-grow bg-background-secondary border border-secondary rounded-md px-3 py-2 text-body text-black focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Add a tag..."
        />
        <button onClick={handleAddTag} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent-focus">Add</button>
        <button 
          onClick={handleAutoTag}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-text rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        >
          <SparklesIcon className="w-4 h-4 text-accent" />
          <span>Auto Tag</span>
        </button>
      </div>
    </div>
  );
};

export default TagManager;
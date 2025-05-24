import React from 'react';
import * as z from 'zod';
import { Prompt, promptSchema } from '../../../api/schemas';

// Define Zod schemas for component props
export const CatalogItemPropsSchema = z.object({
  prompt: promptSchema,
  onSelect: z.function().args(promptSchema).returns(z.void()),
  onDelete: z.function().args(z.string()).returns(z.void()).optional(),
  onDuplicate: z.function().args(z.string()).returns(z.void()).optional()
});

// Derive type from schema
type CatalogItemProps = z.infer<typeof CatalogItemPropsSchema>;

export function CatalogItem({ prompt, onSelect, onDelete, onDuplicate }: CatalogItemProps) {
  return (
    <li className="prompt-item list-group-item">
      <div 
        className="prompt-content" 
        onClick={() => onSelect(prompt)}
      >
        <h3>{prompt.title}</h3>
        <p>{prompt.content.substring(0, 100)}...</p>
        <div className="prompt-meta">
          <span>{new Date(prompt.updatedAt).toLocaleDateString()}</span>
          {!!prompt.tags.length && (
            <div className="tags">
              {prompt.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      {(onDuplicate || onDelete) && (
        <div className="prompt-actions">
          {onDuplicate && (
            <button 
              onClick={() => onDuplicate(prompt.id)}
              className="copy-btn"
            >
              Copy
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(prompt.id)}
              className="delete-btn"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </li>
  );
} 
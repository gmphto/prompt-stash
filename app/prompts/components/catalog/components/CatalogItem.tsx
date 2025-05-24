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
    <div className="card mb-3 shadow-sm w-100">
      <div 
        className="card-body d-flex flex-column justify-content-between h-100"
        onClick={() => onSelect(prompt)}
      >
        <div>
          <h5 className="card-title">{prompt.title}</h5>
          <p className="card-text">{prompt.content.substring(0, 100)}...</p>
          
          {/* Date information */}
          <p className="text-muted small mb-2">
            <i className="far fa-calendar-alt mr-1"></i>
            {prompt.updatedAt ? new Date(prompt.updatedAt).toLocaleDateString() : 'No date'}
          </p>
          
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="mb-2">
              {prompt.tags.map(tag => (
                <span key={tag} className="tag">{'#' + tag}</span>
              ))}
            </div>
          )}
        </div>
        
        {(onDuplicate || onDelete) && (
          <div className="card-actions mt-3">
            {onDuplicate && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(prompt.id);
                }}
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="fa fa-copy mr-1"></i> Copy
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(prompt.id);
                }}
                className="btn btn-outline-danger btn-sm"
              >
                <i className="fa fa-trash mr-1"></i> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
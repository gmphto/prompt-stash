import React from 'react';
import * as z from 'zod';

// Define Zod schemas for component props
export const CatalogTagsPropsSchema = z.object({
  tags: z.array(z.string()),
  selectedTags: z.array(z.string()),
  onTagToggle: z.function().args(z.string()).returns(z.void()),
  title: z.string().optional(),
});

// Derive type from schema
type CatalogTagsProps = z.infer<typeof CatalogTagsPropsSchema>;

export function CatalogTags({ 
  tags, 
  selectedTags, 
  onTagToggle,
  title = "Tags"
}: CatalogTagsProps) {
  if (!tags.length) return null;
  
  // Styles
  const cssStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.1rem',
    margin: '0.1rem 0'
  };
  
  const tagStyle = (isSelected: boolean): React.CSSProperties => ({
    border: `1px solid ${isSelected ? '#007bff' : '#ccc'}`,
    borderRadius: '2px',
    padding: '0.25rem 0.75rem',
    margin: '0.25rem',
    cursor: 'pointer',
    transition: '0.2s ease',
    userSelect: 'none',
    backgroundColor: isSelected ? '#007bff' : 'transparent',
    color: isSelected ? '#fff' : 'inherit',
    fontSize: '14px',
    display: 'inline-block'
  });
  
  return (
    <>
      <div style={cssStyle}>
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <div
              key={tag}
              onClick={() => onTagToggle(tag)}
              style={tagStyle(isSelected)}
              role="button"
              aria-pressed={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onTagToggle(tag);
                  e.preventDefault();
                }
              }}
            >
              {tag}
            </div>
          );
        })}
      </div>
    </>
  );
} 
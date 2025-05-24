import React, { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  if (!tags.length) return null;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Count of selected tags
  const selectedCount = selectedTags.length;
  const totalCount = tags.length;
  
  // Styles
  const dropdownContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '200px',
    marginBottom: '8px'
  };
  
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    color: '#374151'
  };
  
  const buttonTextStyle: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
  
  const countBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 4px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'white',
    backgroundColor: '#3b82f6',
    borderRadius: '10px',
    marginLeft: '8px'
  };
  
  const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    marginTop: '4px',
    padding: '4px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 10,
    border: '1px solid #e5e7eb',
    maxHeight: '200px',
    overflowY: 'auto'
  };
  
  const tagItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '6px 8px',
    fontSize: '14px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left'
  };
  
  const checkboxStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    marginRight: '8px',
    position: 'relative'
  };
  
  const checkmarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1px',
    left: '4px',
    width: '8px',
    height: '8px',
    color: 'white'
  };
  
  // Generate the button label
  const getButtonLabel = () => {
    if (selectedCount === 0) {
      return title;
    } else if (selectedCount === 1) {
      return selectedTags[0];
    } else {
      return `${selectedCount} ${title} selected`;
    }
  };
  
  return (
    <div ref={dropdownRef} style={dropdownContainerStyle}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={buttonTextStyle}>{getButtonLabel()}</span>
        {selectedCount > 0 && (
          <span style={countBadgeStyle}>{selectedCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div 
          style={dropdownMenuStyle}
          role="listbox"
          aria-label={`${title} options`}
        >
          {tags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                role="option"
                aria-selected={isSelected}
                style={{
                  ...tagItemStyle,
                  backgroundColor: isSelected ? '#f3f4f6' : 'transparent'
                }}
                onClick={() => onTagToggle(tag)}
              >
                <span style={checkboxStyle}>
                  {isSelected && (
                    <span style={{
                      ...checkboxStyle,
                      backgroundColor: '#3b82f6',
                      border: '1px solid #3b82f6'
                    }}>
                      <span style={checkmarkStyle} aria-hidden="true">✓</span>
                    </span>
                  )}
                </span>
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 
import React from 'react';
import * as z from 'zod';

// Define Zod schemas for component props
export const CatalogSearchPropsSchema = z.object({
  value: z.string(),
  onChange: z.function().args(z.string()).returns(z.void())
});

// Derive type from schema
type CatalogSearchProps = z.infer<typeof CatalogSearchPropsSchema>;

export function CatalogSearch({ value, onChange }: CatalogSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search prompts..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="prompt-search"
    />
  );
} 
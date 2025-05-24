import React from 'react';
import * as z from 'zod';

// Define Zod schemas for component props
export const CatalogEmptyPropsSchema = z.object({
  hasPrompts: z.boolean()
});

// Derive type from schema
type CatalogEmptyProps = z.infer<typeof CatalogEmptyPropsSchema>;

export function CatalogEmpty({ hasPrompts }: CatalogEmptyProps) {
  return (
    <div className="no-prompts">
      {!hasPrompts ? 'Create your first prompt' : 'No matching results'}
    </div>
  );
} 
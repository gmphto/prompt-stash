import React from 'react';
import * as z from 'zod';
import { SortOptions, SortDirectionType, SortOptionsType } from '../sorting';

// Define Zod schemas for component props
export const CatalogSorterPropsSchema = z.object({
  sortBy: SortOptions,
  sortDir: z.enum(['asc', 'desc']),
  onSort: z.function().args(SortOptions).returns(z.void())
});

// Derive type from schema
type CatalogSorterProps = z.infer<typeof CatalogSorterPropsSchema>;

export function CatalogSorter({ sortBy, sortDir, onSort }: CatalogSorterProps) {
  return (
    <div className="prompt-sort d-inline-flex align-items-center" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label htmlFor="sort-select" className='mb-0 mr-2'>Sort by:</label>
      <select 
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSort(e.target.value as SortOptionsType)}
        className="sort-dropdown form-control"
        style={{ width: 'auto' }}
      >
        <option value="title">
          Title {sortDir === 'asc' ? '↑' : '↓'}
        </option>
        <option value="updatedAt">
          Last Updated {sortDir === 'asc' ? '↑' : '↓'}
        </option>
      </select>
    </div>
  );
} 
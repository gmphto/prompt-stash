import { useState, useMemo } from 'react';
import * as z from 'zod';
import { Prompt, promptSchema } from '../../../api/schemas';
import Sort, { SortOptions, SortOptionsType, SortDirection } from '../sorting';
import Search, { SearchSchema } from '../searching';

// Define schema for filtering state
export const BrowseStateSchema = z.object({
  search: z.string(),
  selectedTags: z.array(z.string()),
  sortBy: SortOptions,
  sortDir: SortDirection
});

// Define input schema
export const BrowseInputSchema = z.object({
  prompts: z.array(promptSchema).optional()
});

// Define return schema
export const BrowseReturnSchema = z.object({
  filteredPrompts: z.array(promptSchema),
  allTags: z.array(z.string()),
  state: BrowseStateSchema,
  toggleSort: z.function().args(SortOptions).returns(z.void()),
  toggleTag: z.function().args(z.string()).returns(z.void()),
  updateSearch: z.function().args(z.string()).returns(z.void())
});

// Pure function
function extractAllTags(prompts: Prompt[]): string[] {
  return Array.from(
    new Set(prompts.flatMap(p => p.tags))
  ).sort();
}

// Pure function
function update(
  prompts: Prompt[], 
  filterState: z.infer<typeof BrowseStateSchema>
): Prompt[] {
  const { search, selectedTags, sortBy, sortDir } = filterState;
  
  // First filter the prompts
  const r = Search(prompts, {
    search,
    selectedTags,
    searchBy: 'all'
  });
  
  // Then use the Sort pure function from sorting.ts
  return Sort(r, {
    sortBy,
    sortDirection: sortDir
  });
}

/**
 * Hook for browsing, filtering, and sorting prompts in the catalog
 * 
 * Features:
 * - Text search through titles and content
 * - Tag filtering with multi-select
 * - Sorting by title or update date
 * - Toggle sort direction
 */
export function useCatalogBrowse(
  props: z.infer<typeof BrowseInputSchema>
): z.infer<typeof BrowseReturnSchema> {
  const { prompts = [] } = props;
  
  const [state, setState] = useState<z.infer<typeof BrowseStateSchema>>({
    search: '',
    selectedTags: [],
    sortBy: 'updatedAt',
    sortDir: 'desc'
  });
  
  // Use memoization for performance - tag extraction is expensive
  const allTags = useMemo(() => extractAllTags(prompts), [prompts]);
  
  // Use memoization for performance - filtering and sorting is expensive
  const result = useMemo(
    () => update(prompts, state),
    [prompts, state]
  );
  
  const toggleSort = (sortField: SortOptionsType): void => {
    setState(prev => ({
      ...prev,
      sortBy: sortField,
      sortDir: prev.sortBy === sortField 
        ? prev.sortDir === 'asc' ? 'desc' : 'asc'
        : 'asc'
    }));
  };

  const toggleTag = (tag: string): void => {
    setState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag) 
        ? prev.selectedTags.filter(t => t !== tag) 
        : [...prev.selectedTags, tag]
    }));
  };
  
  const updateSearch = (value: string): void => {
    setState(prev => ({
      ...prev,
      search: value
    }));
  };
  
  return {
    filteredPrompts: result,
    allTags,
    state,
    toggleSort,
    toggleTag,
    updateSearch
  };
} 
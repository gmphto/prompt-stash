import { useState, useMemo, useEffect, useCallback } from 'react';
import * as z from 'zod';
import { Prompt, promptSchema } from '../../../api/schemas';
import { useManager } from '../../../hooks/useManager';
import Sort, { SortOptions, SortOptionsType, SortDirection } from '../sorting';
import Search, { SearchSchema } from '../searching';

// Define schema for filtering state
export const CatalogStateSchema = z.object({
  search: z.string(),
  selectedTags: z.array(z.string()),
  sortBy: SortOptions,
  sortDir: SortDirection
});

// Define return schema 
export const CatalogStateReturnSchema = z.object({
  prompts: z.array(promptSchema),
  filteredPrompts: z.array(promptSchema),
  allTags: z.array(z.string()),
  isLoading: z.boolean(),
  error: z.string().optional(),
  filterState: CatalogStateSchema,
  toggleSort: z.function().args(SortOptions).returns(z.void()),
  toggleTag: z.function().args(z.string()).returns(z.void()),
  updateSearch: z.function().args(z.string()).returns(z.void()),
  selectPrompt: z.function().args(z.string()).returns(z.void()),
  editPrompt: z.function().args(z.string()).returns(z.void()),
  deletePrompt: z.function().args(z.string()).returns(z.promise(z.void())),
  duplicatePrompt: z.function().args(z.string()).returns(z.promise(z.void()))
});

// Type derived from schema
export type CatalogStateReturn = z.infer<typeof CatalogStateReturnSchema>;

// Pure function
function extractAllTags(prompts: Prompt[]): string[] {
  return Array.from(
    new Set(prompts.flatMap(p => p.tags))
  ).sort();
}

// Pure function
function filterAndSortPrompts(
  prompts: Prompt[], 
  filterState: z.infer<typeof CatalogStateSchema>
): Prompt[] {
  const { search, selectedTags, sortBy, sortDir } = filterState;
  
  // First filter the prompts
  const filtered = Search(prompts, {
    search,
    selectedTags,
    searchBy: 'all'
  });
  
  // Then use the Sort pure function from sorting.ts
  return Sort(filtered, {
    sortBy,
    sortDirection: sortDir
  });
}

/**
 * Hook for catalog state management that integrates with the central state
 * 
 * Features:
 * - Fetches prompts from central state
 * - Provides filtering and sorting
 * - Dispatches actions to central state
 * - Handles CRUD operations on prompts
 */
export function useCatalogState(): CatalogStateReturn {
  // Connect to the central state
  const { state: globalState, actions } = useManager();
  
  // Local filter state
  const [filterState, setFilterState] = useState<z.infer<typeof CatalogStateSchema>>({
    search: '',
    selectedTags: [],
    sortBy: 'updatedAt',
    sortDir: 'desc'
  });
  
  // Load prompts on mount
  useEffect(() => {
    actions.loadPrompts();
  }, []);
  
  // Extract all tags from prompts
  const allTags = useMemo(
    () => extractAllTags(globalState.prompts), 
    [globalState.prompts]
  );
  
  // Filter and sort prompts
  const filteredPrompts = useMemo(
    () => filterAndSortPrompts(globalState.prompts, filterState),
    [globalState.prompts, filterState]
  );
  
  // Filter state updaters
  const toggleSort = useCallback((sortField: SortOptionsType): void => {
    setFilterState(prev => ({
      ...prev,
      sortBy: sortField,
      sortDir: prev.sortBy === sortField 
        ? prev.sortDir === 'asc' ? 'desc' : 'asc'
        : 'asc'
    }));
  }, []);

  const toggleTag = useCallback((tag: string): void => {
    setFilterState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag) 
        ? prev.selectedTags.filter(t => t !== tag) 
        : [...prev.selectedTags, tag]
    }));
  }, []);
  
  const updateSearch = useCallback((value: string): void => {
    setFilterState(prev => ({
      ...prev,
      search: value
    }));
  }, []);
  
  // Action handlers that integrate with global state
  const selectPrompt = useCallback((promptId: string): void => {
    actions.selectPrompt(promptId);
  }, [actions]);
  
  const editPrompt = useCallback((promptId: string): void => {
    actions.editPrompt(promptId);
  }, [actions]);
  
  const deletePrompt = useCallback(async (promptId: string): Promise<void> => {
    return actions.deletePrompt(promptId);
  }, [actions]);
  
  // Helper for duplicating prompts
  const duplicatePrompt = useCallback(async (promptId: string): Promise<void> => {
    const prompt = globalState.prompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    const newPrompt = {
      ...prompt,
      id: crypto.randomUUID(), // Generate new ID
      title: `${prompt.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await actions.savePrompt(newPrompt);
  }, [globalState.prompts, actions]);
  
  return {
    prompts: globalState.prompts,
    filteredPrompts,
    allTags,
    isLoading: globalState.loading,
    error: globalState.error,
    filterState,
    toggleSort,
    toggleTag,
    updateSearch,
    selectPrompt,
    editPrompt,
    deletePrompt,
    duplicatePrompt
  };
} 
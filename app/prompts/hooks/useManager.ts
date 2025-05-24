import { useCallback } from 'react';
import * as z from 'zod';
import { Prompt, AppState } from '../types';
import { useStateContext } from '../state/StateProvider';
import {
  loadPrompts as loadPromptsAction,
  savePrompt as savePromptAction,
  deletePrompt as deletePromptAction
} from '../state';

// Define schema for the hook return type
export const ManagerReturnSchema = z.object({
  state: z.object({
    prompts: z.array(z.any()),
    loading: z.boolean(),
    error: z.string().optional(),
    selectedPromptId: z.string().optional(),
    editor: z.object({
      currentContent: z.string(),
      isDirty: z.boolean(),
      isSaving: z.boolean(),
      lastSaved: z.string().optional(),
      error: z.string().optional(),
      maxLength: z.number(),
      readOnly: z.boolean(),
      autoSaveInterval: z.number()
    })
  }),
  actions: z.object({
    loadPrompts: z.function().returns(z.promise(z.void())),
    savePrompt: z.function().args(z.any()).returns(z.promise(z.void())),
    deletePrompt: z.function().args(z.string()).returns(z.promise(z.void())),
    selectPrompt: z.function().args(z.string()).returns(z.void()),
    editPrompt: z.function().args(z.string()).returns(z.void()),
    updateEditorContent: z.function().args(z.string()).returns(z.void()),
    resetEditor: z.function().returns(z.void())
  })
});

// Type derived from schema
export type ManagerReturn = z.infer<typeof ManagerReturnSchema>;

/**
 * Hook for managing prompts globally across the application
 * Uses the context provided by StateProvider
 * 
 * Features:
 * - Provides access to the global state
 * - Dispatches actions to the global state
 * - Handles CRUD operations on prompts
 * - Manages editor state
 */
export function useManager(): ManagerReturn {
  // Get state and dispatch from context
  const { state, dispatch } = useStateContext();
  
  // Define action creators as callbacks
  const actions = {
    // Load all prompts
    loadPrompts: useCallback(async () => {
      await loadPromptsAction(dispatch);
    }, [dispatch]),
    
    // Save a prompt
    savePrompt: useCallback(async (promptData: Partial<Prompt>) => {
      await savePromptAction(dispatch, promptData);
    }, [dispatch]),
    
    // Delete a prompt
    deletePrompt: useCallback(async (promptId: string) => {
      await deletePromptAction(dispatch, promptId);
    }, [dispatch]),
    
    // Select a prompt
    selectPrompt: useCallback((promptId: string) => {
      dispatch({
        type: 'SELECT_PROMPT',
        payload: promptId
      });
    }, [dispatch]),
    
    // Edit a prompt in the editor
    editPrompt: useCallback((promptId: string) => {
      // Find the prompt
      const prompt = state.prompts.find((p: any) => p.id === promptId);
      
      if (prompt) {
        // Select it and update the editor
        dispatch({
          type: 'SELECT_PROMPT',
          payload: promptId
        });
        
        dispatch({
          type: 'EDITOR_RESET',
          payload: prompt.content
        });
      }
    }, [state.prompts, dispatch]),
    
    // Update editor content
    updateEditorContent: useCallback((content: string) => {
      dispatch({
        type: 'EDITOR_CONTENT_CHANGE',
        payload: content
      });
    }, [dispatch]),
    
    // Reset the editor
    resetEditor: useCallback(() => {
      dispatch({
        type: 'EDITOR_RESET',
        payload: ''
      });
    }, [dispatch])
  };
  
  return {
    state,
    actions
  };
} 
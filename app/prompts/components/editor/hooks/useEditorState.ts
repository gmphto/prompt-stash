import { useReducer, useCallback, useEffect, useRef } from 'react';
import * as z from 'zod';
import { EditorData } from '../../../types';
import {
  EditorState, 
  EditorConfig, 
  EditorAction, 
  EditorHookReturn,
  EditorHookReturnSchema,
  initialEditorState,
  editorReducer,
  editorActions
} from '../../../state/editor';

// Define schema for the hook input parameters
export const EditorStateInputSchema = z.object({
  initialContent: z.string(),
  config: z.object({
    height: z.union([z.string(), z.number()]).optional(),
    maxLength: z.number().optional(),
    readOnly: z.boolean().optional(),
    autoSaveInterval: z.number().optional()
  }).optional(),
  onSave: z.function().args(z.any(), z.boolean().optional()).returns(z.void()).optional(),
  onSubmit: z.function().args(z.any()).returns(z.void()).optional()
});

// Type derived from schema
export type EditorStateInput = z.infer<typeof EditorStateInputSchema>;

// Define the save function type
export type SaveFunction = (data: EditorData) => Promise<void>;

/**
 * Hook for managing editor state with centralized state management
 * 
 * Features:
 * - Content state management
 * - Auto-save with configurable interval
 * - Form validation
 * - Error handling
 */
export function useEditorState(
  props: EditorStateInput
): Omit<EditorHookReturn, 'saveContent'> & { 
  saveContent: (saveFunction: SaveFunction) => Promise<void> 
} {
  const { initialContent, config = {}, onSave, onSubmit } = props;
  
  // Extract config values to use as dependencies
  const { 
    height, 
    maxLength = initialEditorState.maxLength, 
    readOnly = initialEditorState.readOnly, 
    autoSaveInterval = initialEditorState.autoSaveInterval 
  } = config;
  
  // Initialize state with provided config
  const initialState: EditorState = {
    ...initialEditorState,
    currentContent: initialContent,
    maxLength: maxLength ?? initialEditorState.maxLength,
    readOnly: readOnly ?? initialEditorState.readOnly,
    autoSaveInterval: autoSaveInterval ?? initialEditorState.autoSaveInterval
  };
  
  // Set up reducer
  const [state, dispatch] = useReducer(editorReducer, initialState);
  
  // Use a ref to track initial mount
  const isInitialMount = useRef(true);
  
  // Set up auto-save effect
  useEffect(() => {
    if (!onSave || state.readOnly || !state.isDirty || state.error) return;
    
    const timer = setTimeout(() => {
      saveContent(async (data: EditorData) => {
        onSave(data, false);
        return Promise.resolve();
      });
    }, state.autoSaveInterval);
    
    return () => {
      clearTimeout(timer);
    };
  }, [state.currentContent, state.isDirty, state.error, state.autoSaveInterval, state.readOnly]);
  
  // Change content handler
  const changeContent = useCallback((content: string) => {
    dispatch(editorActions.changeContent(content));
  }, []);
  
  // Save content handler
  const saveContent = useCallback(async (saveFunction: SaveFunction) => {
    if (state.error) return;
    
    try {
      await editorActions.saveContent(dispatch, state.currentContent, saveFunction);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  }, [state.currentContent, state.error]);
  
  // Submit content handler
  const submitContent = useCallback(() => {
    if (!onSubmit || state.error) return;
    
    dispatch(editorActions.submitContent(state.currentContent));
    onSubmit({ content: state.currentContent });
  }, [state.currentContent, state.error, onSubmit]);
  
  // Reset editor handler
  const resetEditor = useCallback((content: string) => {
    dispatch(editorActions.resetEditor(content));
  }, []);
  
  // Update config only when individual props change (not the entire config object)
  useEffect(() => {
    // Skip on initial mount since we already set these in initialState
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Create an object with only the properties that need updating
    const configUpdate: Partial<EditorConfig> = {};
    
    if (maxLength !== undefined && maxLength !== state.maxLength) {
      configUpdate.maxLength = maxLength;
    }
    
    if (readOnly !== undefined && readOnly !== state.readOnly) {
      configUpdate.readOnly = readOnly;
    }
    
    if (autoSaveInterval !== undefined && autoSaveInterval !== state.autoSaveInterval) {
      configUpdate.autoSaveInterval = autoSaveInterval;
    }
    
    if (height !== undefined) {
      configUpdate.height = height;
    }
    
    // Only dispatch if there are actual changes
    if (Object.keys(configUpdate).length > 0) {
      dispatch(editorActions.changeConfig(configUpdate));
    }
  }, [maxLength, readOnly, autoSaveInterval, height, state.maxLength, state.readOnly, state.autoSaveInterval]);
  
  return {
    state,
    changeContent,
    saveContent,
    submitContent,
    resetEditor
  };
} 
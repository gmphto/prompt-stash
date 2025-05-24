// State and API Actions
import { PromptAction } from './state';
import { EditorAction } from './editor';

// Union of all action types
export type AppAction = PromptAction | EditorAction;

// Action names for easier reference
export const ActionTypes = {
  // Prompt actions
  LOAD_PROMPTS_REQUEST: 'LOAD_PROMPTS_REQUEST' as const,
  LOAD_PROMPTS_SUCCESS: 'LOAD_PROMPTS_SUCCESS' as const,
  LOAD_PROMPTS_FAILURE: 'LOAD_PROMPTS_FAILURE' as const,
  SELECT_PROMPT: 'SELECT_PROMPT' as const,
  SAVE_PROMPT_REQUEST: 'SAVE_PROMPT_REQUEST' as const,
  SAVE_PROMPT_SUCCESS: 'SAVE_PROMPT_SUCCESS' as const,
  SAVE_PROMPT_FAILURE: 'SAVE_PROMPT_FAILURE' as const,
  DELETE_PROMPT_REQUEST: 'DELETE_PROMPT_REQUEST' as const,
  DELETE_PROMPT_SUCCESS: 'DELETE_PROMPT_SUCCESS' as const,
  DELETE_PROMPT_FAILURE: 'DELETE_PROMPT_FAILURE' as const,
  
  // Editor actions
  EDITOR_CONTENT_CHANGE: 'EDITOR_CONTENT_CHANGE' as const,
  EDITOR_SAVE_REQUEST: 'EDITOR_SAVE_REQUEST' as const,
  EDITOR_SAVE_SUCCESS: 'EDITOR_SAVE_SUCCESS' as const,
  EDITOR_SAVE_FAILURE: 'EDITOR_SAVE_FAILURE' as const,
  EDITOR_SUBMIT: 'EDITOR_SUBMIT' as const,
  EDITOR_CONFIG_CHANGE: 'EDITOR_CONFIG_CHANGE' as const,
  EDITOR_RESET: 'EDITOR_RESET' as const
}; 
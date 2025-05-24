import { z } from 'zod';
import { Prompt, promptSchema } from '../api/schemas';
import * as promptApi from '../api/prompt.api';
import { EditorStateSchema, EditorState, initialEditorState } from './editor';

// Combined state schema
export const AppStateSchema = z.object({
  prompts: z.array(promptSchema),
  loading: z.boolean(),
  error: z.string().optional(),
  selectedPromptId: z.string().optional(),
  editor: EditorStateSchema
});

// Type derived from schema
export type AppState = z.infer<typeof AppStateSchema>;

// State schema (for backward compatibility)
export const PromptStateSchema = z.object({
  prompts: z.array(promptSchema),
  loading: z.boolean(),
  error: z.string().optional(),
  selectedPromptId: z.string().optional()
});

// Type derived from schema
export type PromptState = z.infer<typeof PromptStateSchema>;

// Action schemas
export const PromptActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('LOAD_PROMPTS_REQUEST')
  }),
  z.object({
    type: z.literal('LOAD_PROMPTS_SUCCESS'), 
    payload: z.array(promptSchema)
  }),
  z.object({
    type: z.literal('LOAD_PROMPTS_FAILURE'), 
    payload: z.string()
  }),
  z.object({
    type: z.literal('SELECT_PROMPT'), 
    payload: z.string()
  }),
  z.object({
    type: z.literal('SAVE_PROMPT_REQUEST'), 
    payload: promptSchema.partial()
  }),
  z.object({
    type: z.literal('SAVE_PROMPT_SUCCESS'), 
    payload: promptSchema
  }),
  z.object({
    type: z.literal('SAVE_PROMPT_FAILURE'), 
    payload: z.string()
  }),
  z.object({
    type: z.literal('DELETE_PROMPT_REQUEST'), 
    payload: z.string()
  }),
  z.object({
    type: z.literal('DELETE_PROMPT_SUCCESS'), 
    payload: z.string()
  }),
  z.object({
    type: z.literal('DELETE_PROMPT_FAILURE'), 
    payload: z.string()
  })
]);

// Type derived from schema
export type PromptAction = z.infer<typeof PromptActionSchema>;

// Initial state
export const initialState: PromptState = {
  prompts: [],
  loading: false
};

// Initial app state
export const initialAppState: AppState = {
  ...initialState,
  editor: initialEditorState
};

// Reducer function
export const promptReducer = (state: PromptState, action: PromptAction): PromptState => {
  switch (action.type) {
    case 'LOAD_PROMPTS_REQUEST':
      return { ...state, loading: true, error: undefined };
      
    case 'LOAD_PROMPTS_SUCCESS':
      return { ...state, loading: false, prompts: action.payload };
      
    case 'LOAD_PROMPTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
      
    case 'SELECT_PROMPT':
      return { ...state, selectedPromptId: action.payload };
      
    case 'SAVE_PROMPT_REQUEST':
      return { ...state, loading: true };
      
    case 'SAVE_PROMPT_SUCCESS':
      // If exists, update it; otherwise add it
      const exists = state.prompts.some(p => p.id === action.payload.id);
      const updatedPrompts = exists 
        ? state.prompts.map(p => p.id === action.payload.id ? action.payload : p)
        : [...state.prompts, action.payload];
        
      return { 
        ...state, 
        loading: false, 
        prompts: updatedPrompts,
        selectedPromptId: action.payload.id 
      };
      
    case 'SAVE_PROMPT_FAILURE':
      return { ...state, loading: false, error: action.payload };
      
    case 'DELETE_PROMPT_REQUEST':
      return { ...state, loading: true };
      
    case 'DELETE_PROMPT_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        prompts: state.prompts.filter(p => p.id !== action.payload),
        selectedPromptId: state.selectedPromptId === action.payload 
          ? undefined 
          : state.selectedPromptId
      };
      
    case 'DELETE_PROMPT_FAILURE':
      return { ...state, loading: false, error: action.payload };
      
    default:
      return state;
  }
};

// Action creators
export const loadPrompts = async (dispatch: React.Dispatch<PromptAction>) => {
  dispatch({ type: 'LOAD_PROMPTS_REQUEST' });
  
  try {
    const response = await promptApi.getPrompts();
    dispatch({ 
      type: 'LOAD_PROMPTS_SUCCESS', 
      payload: response.prompts ?? [] 
    });
  } catch (error) {
    dispatch({ 
      type: 'LOAD_PROMPTS_FAILURE', 
      payload: error instanceof Error ? error.message : 'Failed to load prompts' 
    });
  }
};

export const savePrompt = async (
  dispatch: React.Dispatch<PromptAction>,
  promptData: Partial<Prompt>
) => {
  dispatch({ type: 'SAVE_PROMPT_REQUEST', payload: promptData });
  
  try {
    const response = await promptApi.savePrompt(promptData);
    if (!response.prompt) {
      throw new Error('No prompt data returned from API');
    }
    dispatch({ type: 'SAVE_PROMPT_SUCCESS', payload: response.prompt });
    return response.prompt;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save prompt';
    dispatch({ type: 'SAVE_PROMPT_FAILURE', payload: errorMessage });
    throw new Error(errorMessage);
  }
};

export const deletePrompt = async (
  dispatch: React.Dispatch<PromptAction>,
  promptId: string
) => {
  dispatch({ type: 'DELETE_PROMPT_REQUEST', payload: promptId });
  
  try {
    await promptApi.deletePrompt(promptId);
    dispatch({ type: 'DELETE_PROMPT_SUCCESS', payload: promptId });
  } catch (error) {
    dispatch({ 
      type: 'DELETE_PROMPT_FAILURE', 
      payload: error instanceof Error ? error.message : 'Failed to delete prompt' 
    });
  }
}; 
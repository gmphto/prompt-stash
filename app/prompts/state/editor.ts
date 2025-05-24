import { z } from 'zod';
import { EditorData, createEditorSchema } from '../api/schemas';

// Define editor state schema
export const EditorStateSchema = z.object({
  currentContent: z.string(),
  isDirty: z.boolean(),
  isSaving: z.boolean(),
  lastSaved: z.string().optional(),
  error: z.string().optional(),
  maxLength: z.number(),
  readOnly: z.boolean(),
  autoSaveInterval: z.number()
});

// Type derived from schema
export type EditorState = z.infer<typeof EditorStateSchema>;

// Editor config schema
export const EditorConfigSchema = z.object({
  height: z.union([z.string(), z.number()]),
  maxLength: z.number(),
  readOnly: z.boolean(),
  autoSaveInterval: z.number()
});

// Type derived from schema
export type EditorConfig = z.infer<typeof EditorConfigSchema>;

// Editor action schema
export const EditorActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('EDITOR_CONTENT_CHANGE'),
    payload: z.string()
  }),
  z.object({
    type: z.literal('EDITOR_SAVE_REQUEST'),
    payload: z.string()
  }),
  z.object({
    type: z.literal('EDITOR_SAVE_SUCCESS'),
    payload: z.object({
      content: z.string(),
      timestamp: z.string()
    })
  }),
  z.object({
    type: z.literal('EDITOR_SAVE_FAILURE'),
    payload: z.string()
  }),
  z.object({
    type: z.literal('EDITOR_SUBMIT'),
    payload: z.string()
  }),
  z.object({
    type: z.literal('EDITOR_CONFIG_CHANGE'),
    payload: EditorConfigSchema.partial()
  }),
  z.object({
    type: z.literal('EDITOR_RESET'),
    payload: z.string()
  })
]);

// Type derived from schema
export type EditorAction = z.infer<typeof EditorActionSchema>;

// Initial state
export const initialEditorState: EditorState = {
  currentContent: '',
  isDirty: false,
  isSaving: false,
  maxLength: 2000,
  readOnly: false,
  autoSaveInterval: 3000
};

// Pure function for content validation
function validateContent(content: string, maxLength: number): string | undefined {
  try {
    const schema = createEditorSchema(maxLength);
    schema.parse({ content });
    return undefined;
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid content';
  }
}

// Pure function
function getTimestamp(): string {
  return new Date().toISOString();
}

// Reducer function
export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'EDITOR_CONTENT_CHANGE':
      return {
        ...state,
        currentContent: action.payload,
        isDirty: true,
        error: validateContent(action.payload, state.maxLength)
      };
      
    case 'EDITOR_SAVE_REQUEST':
      return {
        ...state,
        isSaving: true
      };
      
    case 'EDITOR_SAVE_SUCCESS':
      return {
        ...state,
        isSaving: false,
        isDirty: false,
        lastSaved: action.payload.timestamp,
        error: undefined
      };
      
    case 'EDITOR_SAVE_FAILURE':
      return {
        ...state,
        isSaving: false,
        error: action.payload
      };
      
    case 'EDITOR_SUBMIT':
      // Submit just marks as saved with the current content
      return {
        ...state,
        isDirty: false,
        lastSaved: getTimestamp(),
        error: undefined
      };
      
    case 'EDITOR_CONFIG_CHANGE':
      return {
        ...state,
        ...action.payload
      };
      
    case 'EDITOR_RESET':
      return {
        ...state,
        currentContent: action.payload,
        isDirty: false,
        error: undefined
      };
      
    default:
      return state;
  }
};

// Action creators
export const editorActions = {
  // Change the editor content
  changeContent: (content: string): EditorAction => ({
    type: 'EDITOR_CONTENT_CHANGE',
    payload: content
  }),
  
  // Save the editor content
  saveContent: async (
    dispatch: React.Dispatch<EditorAction>,
    content: string,
    saveFunction: (data: EditorData) => Promise<void>
  ) => {
    dispatch({ type: 'EDITOR_SAVE_REQUEST', payload: content });
    
    try {
      await saveFunction({ content });
      dispatch({
        type: 'EDITOR_SAVE_SUCCESS',
        payload: {
          content,
          timestamp: getTimestamp()
        }
      });
    } catch (error) {
      dispatch({
        type: 'EDITOR_SAVE_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to save content'
      });
    }
  },
  
  // Submit the editor content
  submitContent: (content: string): EditorAction => ({
    type: 'EDITOR_SUBMIT',
    payload: content
  }),
  
  // Change editor configuration
  changeConfig: (config: Partial<EditorConfig>): EditorAction => ({
    type: 'EDITOR_CONFIG_CHANGE',
    payload: config
  }),
  
  // Reset editor with new content
  resetEditor: (content: string): EditorAction => ({
    type: 'EDITOR_RESET',
    payload: content
  })
};

// Hook return type schema
export const EditorHookReturnSchema = z.object({
  state: EditorStateSchema,
  changeContent: z.function().args(z.string()).returns(z.void()),
  saveContent: z.function().args(z.function()).returns(z.promise(z.void())),
  submitContent: z.function().returns(z.void()),
  resetEditor: z.function().args(z.string()).returns(z.void())
});

// Type derived from schema
export type EditorHookReturn = z.infer<typeof EditorHookReturnSchema>; 
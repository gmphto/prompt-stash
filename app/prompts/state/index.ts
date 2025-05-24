// Re-export all state modules
export * from './state';
export * from './editor';
export * from './actions';

// Export combined state types and utilities
import { AppState, AppStateSchema, initialAppState } from './state';
import { EditorState, EditorAction, editorReducer } from './editor';
import { PromptAction, promptReducer } from './state';
import { AppAction } from './actions';

// Combined reducer that handles both prompt and editor actions
export const appReducer = (state: AppState, action: AppAction): AppState => {
  // Check if it's an editor action
  if (
    action.type === 'EDITOR_CONTENT_CHANGE' ||
    action.type === 'EDITOR_SAVE_REQUEST' ||
    action.type === 'EDITOR_SAVE_SUCCESS' ||
    action.type === 'EDITOR_SAVE_FAILURE' ||
    action.type === 'EDITOR_SUBMIT' ||
    action.type === 'EDITOR_CONFIG_CHANGE' ||
    action.type === 'EDITOR_RESET'
  ) {
    return {
      ...state,
      editor: editorReducer(state.editor, action as EditorAction)
    };
  }
  
  // Otherwise, it's a prompt action
  const promptState = promptReducer({
    prompts: state.prompts,
    loading: state.loading,
    error: state.error,
    selectedPromptId: state.selectedPromptId
  }, action as PromptAction);
  
  return {
    ...promptState,
    editor: state.editor
  };
}; 
import React, { useEffect } from 'react';
import * as z from 'zod';
import Editor from './Editor';
import { useManager } from '../../hooks/useManager';

// Schema for the save handler function
const handleSaveSchema = z.function()
  .args(z.object({ content: z.string() }), z.boolean().optional())
  .returns(z.void());

// Schema for the submit handler function
const handleSubmitSchema = z.function()
  .args(z.object({ content: z.string() }))
  .returns(z.void());

/**
 * Example component that demonstrates editor integration with global state
 */
const EditorExample: React.FC = () => {
  // Get state and actions from the global state manager
  const { state, actions } = useManager();

  // Selected prompt
  const selectedPrompt = state.selectedPromptId
    ? state.prompts.find((prompt: any) => prompt.id === state.selectedPromptId)
    : null;

  // Handle save (auto-save and submission)
  const handleSave: z.infer<typeof handleSaveSchema> = (data, isSubmitted) => {
    // If editing an existing prompt, update it
    if (selectedPrompt) {
      actions.savePrompt({
        ...selectedPrompt,
        content: data.content,
        updatedAt: new Date().toISOString()
      });
    }
    // Otherwise create a new prompt
    else if (data.content.trim()) {
      actions.savePrompt({
        id: crypto.randomUUID(),
        title: data.content.split('\n')[0].substring(0, 50) || 'Untitled Prompt',
        content: data.content,
        tags: ['draft'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Handle submission
  const handleSubmit: z.infer<typeof handleSubmitSchema> = (data) => {
    handleSave(data, true);

    // Show a notification
    alert(selectedPrompt
      ? `Prompt "${selectedPrompt.title}" updated`
      : 'New prompt created');

    // Reset the editor if creating a new prompt
    if (!selectedPrompt) {
      actions.resetEditor();
    }
  };

  // Initialize editor content from selected prompt
  useEffect(() => {
    if (selectedPrompt && selectedPrompt.content !== state.editor.currentContent) {
      actions.updateEditorContent(selectedPrompt.content);
    }
  }, [selectedPrompt, state.editor.currentContent]);

  return (<div className='card border-lightgrey'>
 <div className='card-header' style={{ backgroundColor: '#fff', fontWeight: '600' }}>Editor</div>
    <div className='card-body'>
      {selectedPrompt && (
        <div style={{ marginBottom: '12px' }}>
          <h3>{selectedPrompt.title}</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {selectedPrompt.tags.map(tag => (
              <span key={tag} style={{
                background: '#e2e8f0',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => actions.resetEditor()}
            style={{ marginBottom: '12px' }}
          >
            New Prompt
          </button>
        </div>
      )}

      <Editor
        initialContent={state.editor.currentContent}
        onSave={handleSave}
        onSubmit={handleSubmit}
        height="400px"
        maxLength={4000}
        readOnly={false}
        autoSaveInterval={3000}
      />

      {state.editor.lastSaved && (
        <div style={{
          fontSize: '14px',
          color: '#4a5568',
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          Last saved: {new Date(state.editor.lastSaved).toLocaleTimeString()}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Instructions:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Type your prompt in the editor above</li>
          <li>The editor will auto-save every 3 seconds</li>
          <li>Press Ctrl+Enter (or Cmd+Enter on Mac) to submit</li>
          <li>Select a prompt from the catalog to edit it</li>
        </ul>
      </div>
    </div>
    <div className='card-footer' style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff', gap: '8px' }}>
      <button className='btn btn-warning' style={{ borderRadius: '0px' }} onClick={() => { }}>Cancel</button>
      <button className='btn btn-success' style={{ borderRadius: '0px' }} onClick={() => { }}>Submit</button>
      </div>
  </div>

  );
};

export default EditorExample; 
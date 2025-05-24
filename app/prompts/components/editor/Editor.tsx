import React, { useRef } from 'react';
import { Editor as MonacoEditor, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EditorData, SaveDataFunction } from '../../api/schemas';
import { useEditorState } from './hooks/useEditorState';

// Define schema for editor options
const EditorOptionsSchema = z.object({
  minimap: z.object({ enabled: z.boolean() }),
  lineNumbers: z.enum(['on', 'off', 'relative', 'interval']),
  scrollBeyondLastLine: z.boolean(),
  wordWrap: z.enum(['off', 'on', 'wordWrapColumn', 'bounded']),
  readOnly: z.boolean(),
  fontSize: z.number(),
  tabSize: z.number(),
  autoIndent: z.enum(['none', 'keep', 'brackets', 'advanced', 'full']),
  contextmenu: z.boolean(),
  folding: z.boolean(),
  renderWhitespace: z.enum(['none', 'boundary', 'selection', 'trailing', 'all']),
  renderControlCharacters: z.boolean(),
  renderIndentGuides: z.boolean(),
  hideMargin: z.boolean()
});

// Type derived from schema
type EditorOptions = z.infer<typeof EditorOptionsSchema>;

// Editor options function with Zod validation
const getEditorOptionsSchema = z.function()
  .args(z.boolean())
  .returns(EditorOptionsSchema);

const getEditorOptions: z.infer<typeof getEditorOptionsSchema> = (readOnly) => 
  EditorOptionsSchema.parse({
    minimap: { enabled: false },
    lineNumbers: 'off',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    readOnly,
    fontSize: 14,
    tabSize: 2,
    autoIndent: 'advanced',
    contextmenu: false,
    folding: false,
    renderWhitespace: 'none',
    renderControlCharacters: false,
    renderIndentGuides: false,
    hideMargin: true
  });

// Editor styles
const editorStyles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column' as const, 
    width: '100%' 
  },
  editorWrapper: (height: string | number) => ({ 
    height, 
    border: '1px solid #ddd', 
    borderRadius: 4, 
    overflow: 'hidden' 
  }),
  error: { 
    color: '#e53e3e', 
    fontSize: 14, 
    marginTop: 4 
  }
};

// Define schema for component props
export const EditorPropsSchema = z.object({
  initialContent: z.string().default(''),
  onSave: z.function().args(z.any(), z.boolean().optional()).returns(z.void()).optional(),
  onSubmit: z.function().args(z.any()).returns(z.void()).optional(),
  height: z.union([z.string(), z.number()]).default(200),
  maxLength: z.number().default(2000),
  readOnly: z.boolean().default(false),
  autoSaveInterval: z.number().default(3000)
});

// Type derived from schema
export type EditorProps = z.infer<typeof EditorPropsSchema>;

export const Editor: React.FC<Partial<EditorProps>> = ({
  initialContent = '',
  onSave,
  onSubmit,
  height = 200,
  maxLength = 2000,
  readOnly = false,
  autoSaveInterval = 3000
}) => {
  // Use the editor state hook
  const {
    state,
    changeContent,
    submitContent
  } = useEditorState({
    initialContent,
    config: {
      height,
      maxLength,
      readOnly,
      autoSaveInterval
    },
    onSave,
    onSubmit
  });

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add keyboard shortcut for submission (Ctrl+Enter or Cmd+Enter)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => submitContent()
    );
    
    // Focus the editor
    editor.focus();
  };

  // Create a basic form for the editor
  const { control } = useForm<EditorData>({
    defaultValues: { content: state.currentContent }
  });

  return (
    <div style={editorStyles.container}>
      <div style={editorStyles.editorWrapper(height)}>
        <Controller
          name="content"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MonacoEditor
              height="100%"
              language="markdown"
              value={state.currentContent}
              options={getEditorOptions(state.readOnly)}
              onChange={(value) => changeContent(value || '')}
              onMount={onMount}
            />
          )}
        />
      </div>
      {state.error && (
        <div style={editorStyles.error}>
          {state.error}
        </div>
      )}
      {state.lastSaved && !state.error && !state.isDirty && (
        <div style={{ 
          fontSize: '14px', 
          color: '#4a5568', 
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          Last saved: {new Date(state.lastSaved).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default Editor; 
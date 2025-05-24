import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { editor } from 'monaco-editor';
import { createEditorSchema, EditorData, SaveDataFunction } from '../../../api/schemas';

// Define schema for the hook input parameters
export const EditorInputSchema = z.object({
  initialContent: z.string(),
  maxLength: z.number(),
  onSave: z.function().args(z.any(), z.boolean().optional()).returns(z.void()).optional(),
  autoSaveInterval: z.number().optional()
});

// Define schema for the hook return value
export const EditorReturnSchema = z.object({
  control: z.any(),
  handleSubmit: z.any(), // Use any for complex function types
  errors: z.record(z.any()),
  editorRef: z.any()
});

// Type derived from schema
type EditorReturn = z.infer<typeof EditorReturnSchema>;

/**
 * Hook for managing prompt editor state, validation, and auto-save functionality
 * 
 * Features:
 * - Form validation with zod
 * - Auto-save with configurable interval
 * - Monaco editor integration
 * - Submission handling
 */
export function useEditor(
  props: z.infer<typeof EditorInputSchema>
): EditorReturn {
  const { initialContent, maxLength, onSave, autoSaveInterval = 3000 } = props;
  
  const schema = createEditorSchema(maxLength);
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    getValues 
  } = useForm<EditorData>({
    resolver: zodResolver(schema),
    defaultValues: { content: initialContent },
    mode: 'onChange'
  });
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use memoization for auto-save effect
  useEffect(() => {
    if (!onSave) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      if (isDirty && !errors.content) {
        onSave({ content: getValues('content') }, false);
      }
    }, autoSaveInterval);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDirty, errors.content, getValues, onSave, autoSaveInterval]);

  // Create a wrapper for the handleSubmit to indicate form submission
  const handleFormSubmit = (callback?: (data: EditorData) => void) => {
    return (event?: React.FormEvent) => {
      if (event) event.preventDefault();
      if (onSave) {
        handleSubmit((data) => {
          onSave(data, true);
          if (callback) callback(data);
        })();
      }
    };
  };

  return {
    control,
    handleSubmit: handleFormSubmit,
    errors,
    editorRef
  };
} 
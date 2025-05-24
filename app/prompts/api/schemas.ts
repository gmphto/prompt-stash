import * as z from 'zod';

// Prompt schema definition
export const promptSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Type derived from schema
export type Prompt = z.infer<typeof promptSchema>;

// Editor-specific prompt schema with validation
export const createEditorSchema = (maxLen: number) =>
  z.object({
    content: z
      .string()
      .min(1, 'Prompt is required')
      .max(maxLen, `Prompt max length is ${maxLen}`)
  });

// Maintain compatibility with existing code
export const createPromptEditorSchema = createEditorSchema;

// Type derived from editor schema
export type EditorData = z.infer<ReturnType<typeof createEditorSchema>>;

// Maintain compatibility with existing code
export type PromptEditorData = EditorData;

// Add a type for the saveData function to include isSubmitted parameter
export type SaveDataFunction = (data: EditorData, isSubmitted?: boolean) => void; 
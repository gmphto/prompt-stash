import { z } from 'zod';

// Define the prompt schema
export const promptSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Editor data type
export type EditorData = {
  content: string;
  language: string;
  theme: string;
};

// Mock prompts for development
export const mockPrompts = [
  {
    id: '1',
    title: 'Basic React Component',
    content: 'function Component() {\n  return <div>Hello World</div>;\n}',
    description: 'A simple React functional component',
    tags: ['react', 'component'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'API Request',
    content: 'async function fetchData() {\n  const response = await fetch("/api/data");\n  return response.json();\n}',
    description: 'Fetch data from an API endpoint',
    tags: ['api', 'async'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
export type PromptEditorData = EditorData;

// Add a type for the saveData function to include isSubmitted parameter
export type SaveDataFunction = (data: EditorData, isSubmitted?: boolean) => void; 
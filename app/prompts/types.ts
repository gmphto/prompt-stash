import { z } from 'zod';

// Type Organization Rules:
// 1. Domain entity types only (Prompt, Tag, User, etc.)
// 2. No feature implementation types (no Editor*, UI*, Config*, etc.)
// 3. No component/hook return types
// 4. Types must be derived from schemas using z.infer<typeof Schema>

// Import all schemas
import { promptSchema, EditorData as EditorDataType } from './api/schemas';
import { ApiResponseSchema } from './api/prompt.api';
import {
  AppStateSchema,
  PromptStateSchema,
  PromptActionSchema
} from './state/state';
import { EditorAction } from './state/editor';

// API Types
export type Prompt = z.infer<typeof promptSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type EditorData = EditorDataType;

// State Types
export type AppState = z.infer<typeof AppStateSchema>;
export type PromptState = z.infer<typeof PromptStateSchema>;
export type PromptAction = z.infer<typeof PromptActionSchema>;

// Combined Action Type (from state/actions.ts)
export type AppAction = PromptAction | EditorAction;

// Re-export schemas (needed for some imports)
export {
  promptSchema,
  ApiResponseSchema,
  AppStateSchema,
  PromptStateSchema,
  PromptActionSchema
};

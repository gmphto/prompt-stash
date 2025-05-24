import { Prompt, promptSchema } from './schemas';
import * as z from 'zod';
import { 
  getAllPrompts, 
  getPromptById, 
  savePromptToDb, 
  deletePromptFromDb,
  initDatabase 
} from '../../core/db-service';

// Initialize database on import
initDatabase();

// Define the response schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  prompts: z.array(promptSchema).optional(),
  prompt: promptSchema.optional()
});

// Type derived from schema
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all prompts
 * @returns Promise with all prompts
 */
export const getPrompts = async (): Promise<ApiResponse> => {
  // Simulate network delay
  await delay(500);
  
  try {
    const prompts = getAllPrompts();
    return {
      success: true,
      prompts
    };
  } catch (error) {
    console.error('Error getting prompts:', error);
    return {
      success: false,
      message: 'Failed to retrieve prompts'
    };
  }
};

/**
 * Get a prompt by ID
 * @param id Prompt ID
 * @returns Promise with the prompt
 */
export const getPrompt = async (id: string): Promise<ApiResponse> => {
  // Simulate network delay
  await delay(300);
  
  try {
    const prompt = getPromptById(id);
    
    if (!prompt) {
      return {
        success: false,
        message: `Prompt with ID ${id} not found`
      };
    }
    
    return {
      success: true,
      prompt
    };
  } catch (error) {
    console.error('Error getting prompt:', error);
    return {
      success: false,
      message: `Failed to retrieve prompt with ID ${id}`
    };
  }
};

/**
 * Save a prompt (create or update)
 * @param promptData Prompt data
 * @returns Promise with the saved prompt
 */
export const savePrompt = async (promptData: Partial<Prompt>): Promise<ApiResponse> => {
  // Simulate network delay
  await delay(700);
  
  try {
    const prompt = savePromptToDb(promptData);
    
    return {
      success: true,
      prompt
    };
  } catch (error) {
    console.error('Error saving prompt:', error);
    return {
      success: false,
      message: 'Failed to save prompt'
    };
  }
};

/**
 * Delete a prompt
 * @param id Prompt ID
 * @returns Promise with success status
 */
export const deletePrompt = async (id: string): Promise<ApiResponse> => {
  // Simulate network delay
  await delay(400);
  
  try {
    const deleted = deletePromptFromDb(id);
    
    if (!deleted) {
      return {
        success: false,
        message: `Prompt with ID ${id} not found`
      };
    }
    
    return {
      success: true,
      message: `Prompt with ID ${id} deleted successfully`
    };
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return {
      success: false,
      message: `Failed to delete prompt with ID ${id}`
    };
  }
}; 
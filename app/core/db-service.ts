import { Prompt } from '../prompts/api/schemas';

// Local storage key
const STORAGE_KEY = 'promptstash_db';

// Type for the database structure
interface Database {
  prompts: Prompt[];
}

// Initial database with demo prompts
const initialDatabase: Database = {
  prompts: [
    {
      id: '1',
      title: 'Basic Introduction',
      content: 'You are a helpful AI assistant. Your task is to provide concise, accurate information to user queries in a friendly tone.',
      tags: ['introduction', 'general'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Technical Documentation',
      content: 'Create detailed technical documentation for the following API endpoints. Include request/response formats, error codes, and examples for each endpoint.',
      tags: ['technical', 'documentation'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Creative Story',
      content: 'Write a short story in the style of [AUTHOR] about [THEME]. The story should have a clear beginning, middle, and end, with a surprising twist.',
      tags: ['creative', 'story'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

/**
 * Initialize database
 * Ensures the database exists in localStorage
 */
export const initDatabase = (): void => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase));
  }
};

/**
 * Read the database from localStorage
 * @returns Database object
 */
export const readDatabase = (): Database => {
  if (typeof window === 'undefined') {
    return initialDatabase;
  }
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    initDatabase();
    return initialDatabase;
  }
  
  try {
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error('Error parsing database:', error);
    return initialDatabase;
  }
};

/**
 * Write to the database in localStorage
 * @param data Database object to write
 * @returns True if successful
 */
export const writeDatabase = (data: Database): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

/**
 * Get all prompts from the database
 * @returns Array of prompts
 */
export const getAllPrompts = (): Prompt[] => {
  const db = readDatabase();
  return db.prompts;
};

/**
 * Get a prompt by ID
 * @param id Prompt ID
 * @returns Prompt or undefined if not found
 */
export const getPromptById = (id: string): Prompt | undefined => {
  const db = readDatabase();
  return db.prompts.find(p => p.id === id);
};

/**
 * Save a prompt (create or update)
 * @param promptData Prompt data
 * @returns Saved prompt
 */
export const savePromptToDb = (promptData: Partial<Prompt>): Prompt => {
  const db = readDatabase();
  let prompt: Prompt;
  
  // If ID exists, update the prompt
  if (promptData.id && db.prompts.some(p => p.id === promptData.id)) {
    const index = db.prompts.findIndex(p => p.id === promptData.id);
    prompt = {
      ...db.prompts[index],
      ...promptData,
      updatedAt: new Date().toISOString()
    };
    
    db.prompts[index] = prompt;
  } 
  // Otherwise create a new prompt
  else {
    prompt = {
      id: promptData.id || crypto.randomUUID(),
      title: promptData.title || 'Untitled Prompt',
      content: promptData.content || '',
      tags: promptData.tags || [],
      createdAt: promptData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.prompts.push(prompt);
  }
  
  writeDatabase(db);
  return prompt;
};

/**
 * Delete a prompt
 * @param id Prompt ID
 * @returns True if deleted, false if not found
 */
export const deletePromptFromDb = (id: string): boolean => {
  const db = readDatabase();
  const initialLength = db.prompts.length;
  
  db.prompts = db.prompts.filter(p => p.id !== id);
  
  if (db.prompts.length === initialLength) {
    return false;
  }
  
  writeDatabase(db);
  return true;
}; 
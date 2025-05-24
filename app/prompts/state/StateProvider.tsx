import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import * as z from 'zod';
import { AppState } from '../types';
import { appReducer, initialAppState } from './index';
import { AppAction } from './actions';
import { ManagerReturn } from '../hooks/useManager';

// Context schema
const StateContextSchema = z.object({
  state: z.any(), // AppState would be better but using any to avoid circular dependencies
  dispatch: z.function().args(z.any()).returns(z.void()) 
});

// Create the context
const StateContext = createContext<z.infer<typeof StateContextSchema> | undefined>(undefined);

// Props type for the provider
interface StateProviderProps {
  children: ReactNode;
  initialState?: AppState;
}

/**
 * Provider component that makes prompt state available to all child components
 * Uses the useReducer hook with the combined appReducer
 */
export function StateProvider({ 
  children, 
  initialState = initialAppState 
}: StateProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // The context value that will be provided
  const contextValue = {
    state,
    dispatch
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}

/**
 * Hook that provides direct access to the context
 * Used by other more specific hooks
 */
export function useStateContext() {
  const context = useContext(StateContext);
  
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  
  return context;
}

/**
 * Factory function that creates a state selector hook
 * Used to create more specific selectors for different parts of the state
 */
export function createStateSelector<T>(selector: (state: AppState) => T) {
  return function useStateSelector(): T {
    const { state } = useStateContext();
    return selector(state);
  };
}

/**
 * Factory function that creates an action dispatcher hook
 * Used to create more specific action dispatchers
 */
export function createActionDispatcher<T extends (...args: any[]) => any>(
  actionCreator: T
) {
  return function useActionDispatcher(): (...args: Parameters<T>) => void {
    const { dispatch } = useStateContext();
    
    return (...args: Parameters<T>) => {
      const action = actionCreator(...args);
      dispatch(action);
    };
  };
} 
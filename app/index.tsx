import React from 'react';
import { createRoot } from 'react-dom/client';
import { StateProvider } from './prompts/state/StateProvider';
import EditorExample from './prompts/components/editor/EditorExample';
import Catalog from './prompts/components/catalog/Catalog';

// Simple app component to show we're loaded
const App = () => {
  return (
    <div className="container mt-4">
      <div className="jumbotron">
        <h1 className="display-4">PromptStash</h1>
        <p className="lead">Your prompt management tool is loading...</p>
        <hr className="my-4" />
        <p>If you're seeing this message, the basic app is working. Components will appear here.</p>
      </div>
      <Catalog />
      <EditorExample />
    </div>
  );
};

// Find the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a root
const root = createRoot(rootElement);

// Render the app with the state provider
root.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>
);

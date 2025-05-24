import React from 'react';
import { createRoot } from 'react-dom/client';
import { StateProvider } from './prompts/state/StateProvider';
import EditorExample from './prompts/components/editor/EditorExample';
import Catalog from './prompts/components/catalog/Catalog';

// Simple app component to demonstrate state sharing
const App = () => {
  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
     
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Catalog component using the shared state */}
        <div className='card border-lightgrey' >
          <div className='card-header' style={{ backgroundColor: '#fff', fontWeight: '600' }}>Catalog</div>
          <div className='card-body'>
            <Catalog />
          </div>
        </div>
        
        {/* Editor component using the shared state */}
            <EditorExample />
      </div>
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

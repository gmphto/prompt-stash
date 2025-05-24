# PromptStash

A high-performance React component library for creating, editing, and managing AI prompts.

## PromptEditor Component

The `PromptEditor` component integrates VSCode's Monaco Editor with React Hook Form for a high-performance, feature-rich prompt editing experience.

### Features

- Monaco Editor integration with markdown language support
- Zero re-render overhead with React Hook Form
- Zod schema validation (required prompt, configurable length limit)
- Auto-save capability with configurable intervals
- Keyboard shortcuts (Ctrl/Cmd+Enter to submit)
- Full TypeScript support
- Clean, minimal UI

### Installation

```bash
npm install react react-dom @monaco-editor/react @hookform/resolvers zod react-hook-form
```

### Basic Usage

```tsx
import React from 'react';
import PromptEditor, { PromptData } from './components/PromptEditor';

const MyComponent = () => {
  const handleSubmit = (data: PromptData) => {
    console.log('Prompt submitted:', data.content);
    // Process the prompt data
  };

  return (
    <div>
      <h1>My Prompt Editor</h1>
      <PromptEditor 
        onSubmit={handleSubmit} 
        height="400px" 
      />
    </div>
  );
};

export default MyComponent;
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | `string` | `''` | Initial content value |
| `onSubmit` | `(data: PromptData) => void` | - | Handler for form submission |
| `onAutoSave` | `(data: PromptData) => void` | - | Handler for auto-save (optional) |
| `autoSaveInterval` | `number` | `3000` | Time in milliseconds between auto-saves |
| `height` | `string \| number` | `'300px'` | Editor height |
| `maxLength` | `number` | `4000` | Maximum character limit |
| `readOnly` | `boolean` | `false` | Whether the editor is read-only |
| `placeholder` | `string` | `'Enter your prompt here...'` | Placeholder text |

### Advanced Usage with Auto-Save

```tsx
import React, { useState } from 'react';
import PromptEditor, { PromptData } from './components/PromptEditor';

const AdvancedExample = () => {
  const [savedPrompt, setSavedPrompt] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string>('');

  const handleSubmit = (data: PromptData) => {
    console.log('Submitted prompt:', data.content);
    // Send to API or process further
  };

  const handleAutoSave = (data: PromptData) => {
    console.log('Auto-saving:', data.content);
    setSavedPrompt(data.content);
    setLastSaved(new Date().toLocaleTimeString());
  };

  return (
    <div>
      <h1>Advanced Prompt Editor</h1>
      <PromptEditor
        initialValue={savedPrompt}
        onSubmit={handleSubmit}
        onAutoSave={handleAutoSave}
        autoSaveInterval={2000}
        height="500px"
        maxLength={8000}
      />
      {lastSaved && <p>Last auto-saved: {lastSaved}</p>}
    </div>
  );
};

export default AdvancedExample;
```

## TypeScript Interfaces

```tsx
import { z } from 'zod';

export const promptSchema = z.object({
  content: z
    .string()
    .min(1, 'Prompt is required')
    .max(4000, 'Prompt exceeds maximum length')
});

export type PromptData = z.infer<typeof promptSchema>;
```

## Future Enhancements

- Prompt history management
- Enhanced undo-redo capabilities
- Template support
- Variable insertion
- Collaboration features

## License

MIT 
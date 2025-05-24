const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(__dirname, '..', 'app', 'prompts', 'PromptEditor.tsx');

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split by lines and add an empty line after each
  const lines = data.split('\n');
  let newContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    // Add the original line followed by an empty line
    newContent += lines[i] + '\n\n';
  }

  // Write back to file
  fs.writeFile(filePath, newContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully added empty lines to:', filePath);
  });
}); 
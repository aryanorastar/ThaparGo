// Script to fix TypeScript syntax in JavaScript files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAllFiles(dir) {
  const files = await fs.promises.readdir(dir);
  const allFiles = [];
  
  for (const file of files) {
    if (file.startsWith('.')) continue;
    
    const filePath = path.join(dir, file);
    const stats = await fs.promises.stat(filePath);
    
    if (stats.isDirectory()) {
      const subFiles = await getAllFiles(filePath);
      allFiles.push(...subFiles);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      allFiles.push(filePath);
    }
  }
  
  return allFiles;
}

async function fixFile(filePath) {
  console.log(`Processing ${filePath}`);
  let content = await fs.promises.readFile(filePath, 'utf8');
  let modified = false;
  
  // Fix React.forwardRef<Type1, Type2> syntax
  if (content.includes('React.forwardRef<')) {
    content = content.replace(/React\.forwardRef<[\s\S]*?>/g, 'React.forwardRef');
    modified = true;
  }
  
  // Fix other TypeScript type annotations
  if (content.includes(':')) {
    // Remove type annotations for function parameters
    content = content.replace(/(\w+)\s*:\s*[A-Za-z<>[\]{}|&,\s.]+(?=[,)])/g, '$1');
    modified = true;
  }
  
  // Fix import paths with .jsx.jsx
  if (content.includes('.jsx.jsx')) {
    content = content.replace(/\.jsx\.jsx/g, '.jsx');
    modified = true;
  }
  
  // Fix import from ".utils.jsx" to "./utils.jsx"
  if (content.includes('from ".utils.jsx"')) {
    content = content.replace(/from "\.utils\.jsx"/g, 'from "./utils.jsx"');
    modified = true;
  }
  
  if (modified) {
    await fs.promises.writeFile(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
    return true;
  }
  
  return false;
}

async function main() {
  const srcDir = path.resolve(__dirname, 'src');
  const files = await getAllFiles(srcDir);
  let fixedCount = 0;
  
  for (const file of files) {
    const wasFixed = await fixFile(file);
    if (wasFixed) fixedCount++;
  }
  
  console.log(`Fixed ${fixedCount} files out of ${files.length}`);
}

main().catch(console.error);

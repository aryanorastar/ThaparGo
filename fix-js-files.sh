#!/bin/bash

# Script to fix JavaScript files converted from TypeScript
echo "Fixing JavaScript files converted from TypeScript..."

# Create a backup directory
mkdir -p js_backup

# Function to fix a JavaScript file
fix_js_file() {
  local file=$1
  echo "Fixing $file"
  
  # Create a backup
  cp "$file" "js_backup/$(basename "$file").bak"
  
  # Fix TypeScript type annotations
  # Remove type annotations like: variableName: TypeName
  sed -i '' 's/\([a-zA-Z0-9_]*\): [A-Za-z0-9_<>|&\[\]{}]*\( *[=,)]\)/\1\2/g' "$file"
  
  # Remove TypeScript generics
  sed -i '' 's/useState<[^>]*>/useState/g' "$file"
  sed -i '' 's/useRef<[^>]*>/useRef/g' "$file"
  sed -i '' 's/useMemo<[^>]*>/useMemo/g' "$file"
  sed -i '' 's/useCallback<[^>]*>/useCallback/g' "$file"
  sed -i '' 's/useReducer<[^>]*>/useReducer/g' "$file"
  sed -i '' 's/useContext<[^>]*>/useContext/g' "$file"
  
  # Remove type assertions
  sed -i '' 's/as [A-Za-z0-9_<>|&\[\]{}]*//' "$file"
  
  # Fix object property syntax in toast calls
  sed -i '' 's/title\([A-Za-z0-9_]*\)/title: \1/g' "$file"
  sed -i '' 's/description\([A-Za-z0-9_]*\)/description: \1/g' "$file"
  sed -i '' 's/variant\([A-Za-z0-9_]*\)/variant: \1/g' "$file"
  
  # Fix import paths to use .jsx and .js extensions
  sed -i '' 's/from "\([\.\/]*components\/[^"]*\)"/from "\1.jsx"/g' "$file"
  sed -i '' 's/from "\([\.\/]*pages\/[^"]*\)"/from "\1.jsx"/g' "$file"
  sed -i '' 's/from "\([\.\/]*providers\/[^"]*\)"/from "\1.jsx"/g' "$file"
  sed -i '' 's/from "\([\.\/]*hooks\/[^"]*\)"/from "\1.js"/g' "$file"
  sed -i '' 's/from "\([\.\/]*lib\/[^"]*\)"/from "\1.js"/g' "$file"
  sed -i '' 's/from "\([\.\/]*integrations\/[^"]*\)"/from "\1.js"/g' "$file"
  sed -i '' 's/from "\([\.\/]*data\/[^"]*\)"/from "\1.js"/g' "$file"
  sed -i '' 's/from "\([\.\/]*services\/[^"]*\)"/from "\1.js"/g' "$file"
  
  # Remove TypeScript interface and type definitions
  sed -i '' '/^interface /,/^}/d' "$file"
  sed -i '' '/^type /,/;/d' "$file"
  
  # Remove imports of TypeScript types
  sed -i '' '/import.*from.*types/d' "$file"
  
  echo "Fixed $file"
}

# Fix all JavaScript files
for file in $(find src -name "*.jsx" -o -name "*.js"); do
  fix_js_file "$file"
done

echo "All JavaScript files have been fixed!"

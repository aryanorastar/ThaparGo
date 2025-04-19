#!/bin/bash

# Script to convert TypeScript files to JavaScript
echo "Converting TypeScript files to JavaScript..."

# Convert .tsx files to .jsx
for file in $(find src -name "*.tsx"); do
  newfile="${file%.tsx}.jsx"
  echo "Converting $file to $newfile"
  
  # Copy the file with new extension
  cp "$file" "$newfile"
  
  # Remove TypeScript types and annotations
  sed -i '' 's/: React\.FC<[^>]*>//g' "$newfile"
  sed -i '' 's/: [A-Za-z]*\[\]//g' "$newfile"
  sed -i '' 's/: [A-Za-z]*//g' "$newfile"
  sed -i '' 's/: {[^}]*}//g' "$newfile"
  sed -i '' 's/<[A-Za-z]*>//g' "$newfile"
  
  # Update imports to reference .jsx files
  sed -i '' 's/from ".\/\([A-Za-z]*\)"/from ".\1.jsx"/g' "$newfile"
  sed -i '' 's/from "..\/\([^"]*\)"/from "..\1.jsx"/g' "$newfile"
  
  # Remove TypeScript interface and type definitions
  sed -i '' '/^interface /,/^}/d' "$newfile"
  sed -i '' '/^type /,/;/d' "$newfile"
  
  echo "Converted $file to $newfile"
done

# Convert .ts files to .js
for file in $(find src -name "*.ts" -not -name "*.d.ts"); do
  newfile="${file%.ts}.js"
  echo "Converting $file to $newfile"
  
  # Copy the file with new extension
  cp "$file" "$newfile"
  
  # Remove TypeScript types and annotations
  sed -i '' 's/: [A-Za-z]*\[\]//g' "$newfile"
  sed -i '' 's/: [A-Za-z]*//g' "$newfile"
  sed -i '' 's/: {[^}]*}//g' "$newfile"
  sed -i '' 's/<[A-Za-z]*>//g' "$newfile"
  
  # Update imports to reference .js files
  sed -i '' 's/from ".\/\([A-Za-z]*\)"/from ".\1.js"/g' "$newfile"
  sed -i '' 's/from "..\/\([^"]*\)"/from "..\1.js"/g' "$newfile"
  
  # Remove TypeScript interface and type definitions
  sed -i '' '/^interface /,/^}/d' "$newfile"
  sed -i '' '/^type /,/;/d' "$newfile"
  
  echo "Converted $file to $newfile"
done

# Update imports in index.html
sed -i '' 's/main.tsx/main.jsx/g' index.html

echo "Conversion complete!"

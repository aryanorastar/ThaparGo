#!/bin/bash

# Find all files in the pages directory
find src/pages -type f -name "*.tsx" | while read file; do
  # Replace all imports from @/components/ui/ with relative paths
  sed -i '' 's|@/components/ui/|../components/ui/|g' "$file"
done

echo "All page component imports updated successfully!"

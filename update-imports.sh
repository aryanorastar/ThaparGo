#!/bin/bash

# Find all files in the components/ui directory that import from @/lib/utils
find src/components/ui -type f -name "*.tsx" -o -name "*.ts" | grep -v "utils.ts" | xargs grep -l "@/lib/utils" | while read file; do
  # Replace the import statement in each file
  sed -i '' 's|import { cn } from "@/lib/utils"|import { cn } from "./utils"|g' "$file"
done

echo "All imports updated successfully!"

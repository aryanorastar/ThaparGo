#!/bin/bash

# Fix types imports in pages directory
find src/pages -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' 's|@/types|../types|g' "$file"
  sed -i '' 's|@/integrations/supabase/types|../integrations/supabase/types|g' "$file"
  sed -i '' 's|@/scripts/|../scripts/|g' "$file"
done

# Fix types imports in hooks directory
find src/hooks -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' 's|@/types|../types|g' "$file"
  sed -i '' 's|@/scripts/|../scripts/|g' "$file"
done

# Fix types imports in data directory
find src/data -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' 's|@/types|../types|g' "$file"
done

# Fix UI component imports in components directory
find src/components -type f -name "*.tsx" -o -name "*.ts" | grep -v "ui/" | while read file; do
  sed -i '' 's|@/components/ui/|./ui/|g' "$file"
  sed -i '' 's|@/hooks/|../hooks/|g' "$file"
done

# Fix imports within UI components
find src/components/ui -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' 's|@/components/ui/|./|g' "$file"
  sed -i '' 's|@/hooks/|../../hooks/|g' "$file"
done

echo "All remaining imports fixed successfully!"

#!/bin/bash

# Update imports in pages directory
find src/pages -type f -name "*.tsx" | while read file; do
  sed -i '' 's|@/integrations/supabase/client|../integrations/supabase/client|g' "$file"
done

# Update imports in hooks directory
find src/hooks -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i '' 's|@/integrations/supabase/client|../integrations/supabase/client|g' "$file"
done

# Update imports in providers directory
find src/providers -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i '' 's|@/integrations/supabase/client|../integrations/supabase/client|g' "$file"
done

# Update imports in scripts directory
find src/scripts -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i '' 's|@/integrations/supabase/client|../../integrations/supabase/client|g' "$file"
done

echo "All Supabase client imports updated successfully!"

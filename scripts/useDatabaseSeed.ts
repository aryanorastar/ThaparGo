
import { useEffect, useState } from 'react';
import { seedDatabase, createGetSubjectsFunction } from '../scripts/seedDatabase';
import { supabase } from '../src/integrations/supabase/client';

export const useDatabaseSeed = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await seedDatabase();
        
        // Try to create the get_all_subjects function
        try {
          await createGetSubjectsFunction();
        } catch (err) {
          console.error('Error creating function, but continuing:', err);
        }
        
        setIsSeeded(true);
      } catch (error) {
        console.error('Error initializing database:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  return { isSeeded, loading };
};

// Direct fetch subjects function as a fallback
export const fetchSubjects = async () => {
  try {
    // Use try/catch instead of direct .catch() on Supabase query
    try {
      // Type assertion for RPC call since it's not in the generated types
      // @ts-expect-error - Custom Supabase RPC function not in generated types
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_subjects');
      
      if (!rpcError && rpcData) {
        return { data: rpcData, error: null };
      }
    } catch (rpcErr) {
      console.log('RPC function failed:', rpcErr);
      // Continue to fallback
    }
    
    // If RPC fails, use direct SQL query
    console.log('Falling back to direct query');
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    return { data, error };
  } catch (error) {
    console.error('Error in fetchSubjects:', error);
    return { data: null, error };
  }
};

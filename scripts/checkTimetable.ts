import { supabase } from '../src/integrations/supabase/client';
import type { Database } from '../src/integrations/supabase/types';

type Batch = Database['public']['Tables']['batches']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type Schedule = Database['public']['Tables']['schedules']['Row'];

async function checkData() {
  console.log('Checking timetable data...');
  
  // Check batches
  const { data: batches, error: batchError } = await supabase
    .from('batches')
    .select('*');
  
  console.log('Batches found:', batches?.length || 0);
  if (batches) console.log('Sample batch:', batches[0]);
  
  // Check subjects  
  const { data: subjects, error: subjectError } = await supabase
    .from('subjects')
    .select('*');
    
  console.log('Subjects found:', subjects?.length || 0);
  if (subjects) console.log('Sample subject:', subjects[0]);
  
  // Check schedules
  const { data: schedules, error: scheduleError } = await supabase
    .from('schedules')
    .select('*');
    
  console.log('Schedules found:', schedules?.length || 0);
  if (schedules && schedules.length > 0) {
    console.log('Sample schedule day:', schedules?.[0]?.day);
    console.log('First time slot:', schedules?.[0]?.slots?.[0]);
  }
}

checkData();

import { supabase } from '../src/integrations/supabase/client';
import type { Database } from '../src/integrations/supabase/types';

type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  subject?: string;
  teacher?: string;
  type: 'class' | 'lab' | 'break' | 'free';
};

type Batch = Database['public']['Tables']['batches']['Insert'];
type Subject = Database['public']['Tables']['subjects']['Insert'];
type Teacher = Database['public']['Tables']['teachers']['Insert'];
type BaseSchedule = Database['public']['Tables']['schedules']['Insert'];

interface ScheduleWithSlots extends BaseSchedule {
  slots: TimeSlot[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const TIME_SLOTS = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
] as const;

export const seedTimetable = async (): Promise<void> => {
  try {
    // 1. Seed batches with improved error handling
    const batches: Batch[] = [
      { name: 'CSE A', branch: 'Computer Science', year: 2, section: 'A' },
      { name: 'CSE B', branch: 'Computer Science', year: 2, section: 'B' },
      { name: 'ECE A', branch: 'Electronics', year: 2, section: 'A' },
      { name: 'ME A', branch: 'Mechanical', year: 2, section: 'A' },
    ];

    const { data: batchData, error: batchError } = await supabase
      .from('batches')
      .insert(batches)
      .select();

    if (batchError) throw new Error(`Failed to seed batches: ${batchError.message}`);
    if (!batchData?.length) throw new Error('No batches were created');

    // 2. Seed subjects with type safety
    const subjects: Subject[] = [
      { name: 'Data Structures', subject_code: 'CS201' },
      { name: 'Algorithms', subject_code: 'CS202' },
      { name: 'Database Systems', subject_code: 'CS203' },
      { name: 'Digital Electronics', subject_code: 'EC201' },
      { name: 'Signals & Systems', subject_code: 'EC202' },
      { name: 'Thermodynamics', subject_code: 'ME201' },
      { name: 'Mechanics', subject_code: 'ME202' },
    ];

    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .insert(subjects)
      .select();

    if (subjectError) throw new Error(`Failed to seed subjects: ${subjectError.message}`);
    if (!subjectData?.length) throw new Error('No subjects were created');

    // 3. Seed teachers
    const teachers: Teacher[] = [
      { 
        name: 'Dr. Sharma', 
        department: 'Computer Science', 
        email: 'sharma@thapar.edu',
        subjects: ['CS201', 'CS202']
      },
      { 
        name: 'Prof. Singh', 
        department: 'Electronics', 
        email: 'singh@thapar.edu',
        subjects: ['EC201', 'EC202']
      },
      { 
        name: 'Dr. Gupta', 
        department: 'Mechanical', 
        email: 'gupta@thapar.edu',
        subjects: ['ME201', 'ME202']
      },
    ];

    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .insert(teachers)
      .select();

    if (teacherError) throw new Error(`Failed to seed teachers: ${teacherError.message}`);
    if (!teacherData?.length) throw new Error('No teachers were created');

    // 4. Create schedules for each batch
    for (const batch of batchData) {
      const schedules: ScheduleWithSlots[] = DAYS.map(day => {
        const slots: TimeSlot[] = TIME_SLOTS.map((slot, i) => {
          // Lunch break
          if (slot.start === '12:00') {
            return {
              id: `${batch.id}-${day}-${i}`,
              start_time: slot.start,
              end_time: slot.end,
              type: 'break',
            };
          }

          // Randomly assign subjects or free periods
          const subjectIndex = Math.floor(Math.random() * (subjectData?.length || 0));
          const teacherIndex = Math.floor(Math.random() * (teacherData?.length || 0));
          
          const subject = subjectData?.[subjectIndex];
          const teacher = teacherData?.[teacherIndex];
          
          // Only assign if subject matches branch
          const isValidSubject = 
            (batch.branch === 'Computer Science' && subject?.subject_code?.startsWith('CS')) ||
            (batch.branch === 'Electronics' && subject?.subject_code?.startsWith('EC')) ||
            (batch.branch === 'Mechanical' && subject?.subject_code?.startsWith('ME'));
          
          return {
            id: `${batch.id}-${day}-${i}`,
            start_time: slot.start,
            end_time: slot.end,
            subject: isValidSubject ? subject?.name : undefined,
            teacher: isValidSubject ? teacher?.name : undefined,
            type: isValidSubject ? (Math.random() > 0.7 ? 'lab' : 'class') : 'free',
          };
        });

        return {
          day,
          batch_id: batch.id,
          slots,
        };
      });

      // Insert schedules
      const { error: scheduleError } = await supabase
        .from('schedules')
        .insert(schedules);

      if (scheduleError) throw new Error(`Failed to seed schedules: ${scheduleError.message}`);
    }

    console.log('Timetable data seeded successfully!');
  } catch (error) {
    console.error('Error seeding timetable data:', error instanceof Error ? error.message : error);
    throw error;
  }
};

export {};

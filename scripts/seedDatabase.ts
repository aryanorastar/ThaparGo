
import { supabase } from '../src/integrations/supabase/client';

export const seedDatabase = async () => {
  try {
    // Check if we already have data
    const { count: locationsCount } = await supabase
      .from('locations')
      .select('*', { count: 'exact', head: true });
    
    if (locationsCount && locationsCount > 0) {
      console.log('Database already seeded');
      
      // Check if schedules exist
      const { count: schedulesCount } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true });
      
      if (!schedulesCount || schedulesCount === 0) {
        console.log('No schedules found, creating dummy schedules...');
        await createDummySchedules();
      } else {
        console.log(`Found ${schedulesCount} schedules, skipping schedule creation`);
      }
      
      return;
    }
    
    // Seed locations
    const locations = [
      { 
        name: 'A Block', 
        type: 'Academic', 
        description: 'Main academic building with classrooms and admin offices',
        coordinates: [-15, 0],
      },
      { 
        name: 'B Block', 
        type: 'Academic', 
        description: 'Science and engineering labs',
        coordinates: [-5, 5],
      },
      { 
        name: 'C Block', 
        type: 'Academic', 
        description: 'Computer science and IT department',
        coordinates: [5, 5],
      },
      { 
        name: 'D Block', 
        type: 'Academic', 
        description: 'Business school and humanities',
        coordinates: [15, 0],
      },
      { 
        name: 'Library', 
        type: 'Academic', 
        description: 'Central library with study spaces',
        coordinates: [-15, -10],
      },
      { 
        name: 'Hostel A', 
        type: 'Residence', 
        description: 'First year undergraduate residence',
        coordinates: [-30, -30],
      },
      { 
        name: 'Cafeteria', 
        type: 'Dining', 
        description: 'Main student dining hall',
        coordinates: [0, 15],
      },
    ];
    
    await supabase.from('locations').insert(locations);
    console.log('Locations seeded');
    
    // Seed classrooms
    const classrooms = [
      { name: 'A101', building: 'A Block', floor: '1', capacity: 40 },
      { name: 'A102', building: 'A Block', floor: '1', capacity: 40 },
      { name: 'A201', building: 'A Block', floor: '2', capacity: 60 },
      { name: 'A202', building: 'A Block', floor: '2', capacity: 60 },
      { name: 'B101', building: 'B Block', floor: '1', capacity: 30 },
      { name: 'B102', building: 'B Block', floor: '1', capacity: 25 },
      { name: 'B201', building: 'B Block', floor: '2', capacity: 80 },
      { name: 'C101', building: 'C Block', floor: '1', capacity: 40 },
      { name: 'C102', building: 'C Block', floor: '1', capacity: 40 },
      { name: 'C201', building: 'C Block', floor: '2', capacity: 35 },
      { name: 'D101', building: 'D Block', floor: '1', capacity: 50 },
      { name: 'D102', building: 'D Block', floor: '1', capacity: 50 },
    ];
    
    await supabase.from('classrooms').insert(classrooms);
    console.log('Classrooms seeded');
    
    // Seed batches
    const batches = [
      { name: 'CSE-A', year: 1, branch: 'Computer Science', section: 'A' },
      { name: 'CSE-B', year: 1, branch: 'Computer Science', section: 'B' },
      { name: 'ECE-A', year: 2, branch: 'Electronics', section: 'A' },
      { name: 'MECH-A', year: 3, branch: 'Mechanical', section: 'A' },
      { name: 'CIVIL-A', year: 4, branch: 'Civil', section: 'A' },
    ];
    
    await supabase.from('batches').insert(batches);
    console.log('Batches seeded');
    
    // Seed teachers
    const teachers = [
      { 
        name: 'Dr. Smith', 
        department: 'Computer Science', 
        email: 'smith@example.edu', 
        subjects: ['Data Structures', 'Algorithms'] 
      },
      { 
        name: 'Dr. Johnson', 
        department: 'Electronics', 
        email: 'johnson@example.edu', 
        subjects: ['Digital Electronics', 'Microprocessors'] 
      },
      { 
        name: 'Prof. Williams', 
        department: 'Mechanical', 
        email: 'williams@example.edu', 
        subjects: ['Thermodynamics', 'Fluid Mechanics'] 
      },
      { 
        name: 'Dr. Brown', 
        department: 'Computer Science', 
        email: 'brown@example.edu', 
        subjects: ['Database Systems', 'Web Development'] 
      },
      { 
        name: 'Prof. Taylor', 
        department: 'Mathematics', 
        email: 'taylor@example.edu', 
        subjects: ['Calculus', 'Linear Algebra'] 
      },
    ];
    
    await supabase.from('teachers').insert(teachers);
    console.log('Teachers seeded');
    
    // Seed subjects
    const subjects = [
      { name: 'Data Structures', subject_code: 'CS201' },
      { name: 'Algorithms', subject_code: 'CS202' },
      { name: 'Digital Electronics', subject_code: 'EC201' },
      { name: 'Microprocessors', subject_code: 'EC202' },
      { name: 'Thermodynamics', subject_code: 'ME201' },
      { name: 'Fluid Mechanics', subject_code: 'ME202' },
      { name: 'Database Systems', subject_code: 'CS301' },
      { name: 'Web Development', subject_code: 'CS302' },
      { name: 'Calculus', subject_code: 'MA101' },
      { name: 'Linear Algebra', subject_code: 'MA102' }
    ];
    
    // Check if subjects table exists and has data
    const { count: subjectsCount } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true });
    
    if (!subjectsCount || subjectsCount === 0) {
      await supabase.from('subjects').insert(subjects);
      console.log('Subjects seeded');
    } else {
      console.log('Subjects already exist, skipping seed');
    }
    
    // Create dummy schedules
    await createDummySchedules();
    
    // Create a function to get all subjects
    try {
      // Using proper TypeScript approach with ts-ignore for RPC calls not in types
      // @ts-expect-error
      const { error: functionError } = await supabase.rpc('create_get_subjects_function', {}, {
        count: 'exact',
      });
      
      if (functionError) {
        console.error('Error creating function:', functionError);
      } else {
        console.log('Function created or already exists');
      }
    } catch (err) {
      console.log('Function might already exist, continuing...');
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Function to create dummy schedules
async function createDummySchedules() {
  try {
    console.log('Creating dummy schedules...');
    
    // Fetch batches and subjects for creating schedules
    const { data: batchesData, error: batchesError } = await supabase.from('batches').select('id, name');
    
    if (batchesError || !batchesData) {
      console.error('Error fetching batches:', batchesError);
      return;
    }
    
    // Fetch subjects with a more general select query
    const { data: subjectsData, error: subjectsError } = await supabase.from('subjects').select('*');
    
    if (subjectsError || !subjectsData) {
      console.error('Error fetching subjects:', subjectsError);
      return;
    }
    
    // Fetch classrooms and teachers
    const { data: classroomsData, error: classroomsError } = await supabase.from('classrooms').select('name');
    const { data: teachersData, error: teachersError } = await supabase.from('teachers').select('name');
    
    if (classroomsError || !classroomsData || teachersError || !teachersData) {
      console.error('Error fetching classrooms or teachers:', classroomsError || teachersError);
      return;
    }
    
    console.log(`Found ${batchesData.length} batches, ${subjectsData.length} subjects, ${classroomsData.length} classrooms, and ${teachersData.length} teachers`);
    
    // Check if schedules already exist
    const { count: schedulesCount } = await supabase
      .from('schedules')
      .select('*', { count: 'exact', head: true });
    
    if (schedulesCount && schedulesCount > 0) {
      console.log('Schedules already exist, skipping seed');
      return;
    }
    
    console.log('Creating dummy schedules for each batch');
    
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Create random schedules for each batch
    for (const batch of batchesData) {
      for (const day of weekdays) {
        // Create 8 slots per day (8am to 4pm)
        const slots = Array.from({ length: 8 }).map((_, index) => {
          const startHour = 8 + index;
          const endHour = 9 + index;
          const startTime = `${startHour.toString().padStart(2, '0')}:00`;
          const endTime = `${endHour.toString().padStart(2, '0')}:00`;
          
          // Random subject (80% chance of class, 20% chance of free period)
          const isClass = Math.random() < 0.8;
          
          if (!isClass) {
            return {
              id: `${day.toLowerCase()}-${index}`,
              startTime,
              endTime,
              subject: 'Free Period',
              type: 'free'
            };
          }
          
          // Every 3rd class is a lab
          const isLab = index % 3 === 0;
          
          // Random subject from our list
          const randomSubjectIndex = Math.floor(Math.random() * subjectsData.length);
          const subject = subjectsData[randomSubjectIndex];
          
          // Random teacher
          const randomTeacherIndex = Math.floor(Math.random() * teachersData.length);
          const teacher = teachersData[randomTeacherIndex];
          
          // Random classroom
          const randomClassroomIndex = Math.floor(Math.random() * classroomsData.length);
          const classroom = classroomsData[randomClassroomIndex];
          
          return {
            id: `${day.toLowerCase()}-${index}`,
            startTime,
            endTime,
            subject: subject.name,
            teacher: teacher.name,
            room: classroom.name,
            type: isLab ? 'lab' : 'class'
          };
        });
        
        // Insert schedule for this batch and day
        const { error: insertError } = await supabase.from('schedules').insert({
          batch_id: batch.id,
          day,
          slots
        });
        
        if (insertError) {
          console.error(`Error inserting schedule for batch ${batch.name} on ${day}:`, insertError);
        } else {
          console.log(`Created schedule for batch ${batch.name} on ${day}`);
        }
      }
    }
    
    console.log('Dummy schedules created successfully');
    
  } catch (error) {
    console.error('Error creating dummy schedules:', error);
  }
}

// Function to create the get_all_subjects function
export const createGetSubjectsFunction = async () => {
  try {
    // Using proper TypeScript approach with ts-ignore for RPC calls not in types
    // @ts-expect-error
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION get_all_subjects()
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY SELECT row_to_json(s) FROM (SELECT * FROM subjects) s;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (error) {
      console.error('Error creating function:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating function:', error);
    return false;
  }
};

/**
 * Database types for the ThaparGo application
 * This file provides JavaScript-compatible type definitions
 */

// Export empty objects to maintain imports in other files
export const Database = {};
export const Json = {};

// Define basic database structure for documentation purposes
const databaseSchema = {
  societies: {
    id: 'string',
    name: 'string',
    description: 'string',
    category: 'string',
    logo_url: 'string',
    registration_status: 'string',
    registration_link: 'string',
    faculty_head: 'string',
    room: 'string',
    email: 'string',
    website: 'string',
    instagram: 'string',
    twitter: 'string',
    facebook: 'string',
    created_at: 'timestamp'
  },
  room_bookings: {
    id: 'string',
    room_id: 'string',
    room_name: 'string',
    purpose: 'string',
    society: 'string',
    date: 'string',
    start_time: 'string',
    end_time: 'string',
    status: 'string',
    user_id: 'string',
    created_at: 'timestamp'
  },
  classrooms: {
    id: 'string',
    name: 'string',
    building: 'string',
    floor: 'number',
    capacity: 'number',
    features: 'array',
    created_at: 'timestamp'
  },
  users: {
    id: 'string',
    email: 'string',
    name: 'string',
    role: 'string',
    created_at: 'timestamp'
  },
  batches: {
    id: 'string',
    name: 'string',
    branch: 'string',
    year: 'number',
    section: 'string',
    created_at: 'timestamp'
  },
  schedules: {
    id: 'string',
    batch_id: 'string',
    day: 'string',
    slot: 'string',
    subject: 'string',
    teacher: 'string',
    room: 'string',
    created_at: 'timestamp'
  },
  subjects: {
    id: 'string',
    code: 'string',
    name: 'string',
    credits: 'number',
    department: 'string',
    created_at: 'timestamp'
  },
  teachers: {
    id: 'string',
    name: 'string',
    email: 'string',
    department: 'string',
    created_at: 'timestamp'
  }
};

// This is just for documentation, not used in runtime
export const schema = databaseSchema;

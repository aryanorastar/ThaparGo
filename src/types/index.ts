
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType;
}

export interface Schedule {
  id: string;
  day: string;
  slots: TimeSlot[];
  batch_id: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher?: string;
  room?: string;
  type: 'class' | 'lab' | 'free';
}

export interface Classroom {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  room_no?: string; // Added room_no field
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  purpose: string;
  society: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  userId?: string;
  createdAt?: string;
}

export interface BatchData {
  id: string;
  name: string;
  year: number;
  branch: string;
  section: string;
}

export interface Teacher {
  id: string;
  name: string;
  department: string;
  email: string;
  subjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  department?: string;
  credits?: number;
}

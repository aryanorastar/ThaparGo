
export interface NavItem {
  title: ;
  href;
  icon?.ComponentType;
}

export interface Schedule {
  id;
  day;
  slots;
  batch_id;
}

export interface TimeSlot {
  id;
  startTime;
  endTime;
  subject;
  teacher?;
  room?;
  type'class' | 'lab' | 'free';
}

export interface Classroom {
  id;
  name;
  building;
  floor;
  capacity;
  room_no?; // Added room_no field
}

export interface RoomBooking {
  id;
  roomId;
  roomName;
  purpose;
  society;
  date;
  startTime;
  endTime;
  status'pending' | 'approved' | 'rejected';
  userId?;
  createdAt?;
}

export interface BatchData {
  id;
  name;
  year;
  branch;
  section;
}

export interface Teacher {
  id;
  name;
  department;
  email;
  subjects;
}

export interface Subject {
  id;
  name;
  code?;
  description: ?;
  department?;
  credits?;
}

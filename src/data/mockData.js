

export const scheduleData = [
  {
    id: "monday-1",
    day: "Monday",
    batch_id: "1",
    slots: [
      { id: "mon-1", startTime: "08:00", endTime: "08:50", subject: "Data Structures", teacher: "Dr. Sharma", room: "E-201" },
      { id: "mon-2", startTime: "09:00", endTime: "09:50", subject: "Computer Networks", teacher: "Dr. Kumar", room: "E-301" },
      { id: "mon-3", startTime: "10:00", endTime: "10:50", subject: "Break" },
      { id: "mon-4", startTime: "11:00", endTime: "12:50", subject: "Digital Electronics Lab", teacher: "Dr. Singh", room: "Lab Complex" },
      { id: "mon-5", startTime: "13:00", endTime: "13:50", subject: "Lunch" },
      { id: "mon-6", startTime: "14:00", endTime: "14:50", subject: "Software Engineering", teacher: "Dr. Gupta", room: "D-212" },
      { id: "mon-7", startTime: "15:00", endTime: "15:50", subject: "Free" }
    ]
  },
  {
    id: "tuesday-1",
    day: "Tuesday",
    batch_id: "1",
    slots: [
      { id: "tue-1", startTime: "08:00", endTime: "08:50", subject: "Free" },
      { id: "tue-2", startTime: "09:00", endTime: "09:50", subject: "Discrete Mathematics", teacher: "Dr. Mathur", room: "E-101" },
      { id: "tue-3", startTime: "10:00", endTime: "11:50", subject: "Computer Networks Lab", teacher: "Dr. Kumar", room: "Network Lab" },
      { id: "tue-4", startTime: "12:00", endTime: "12:50", subject: "Free" },
      { id: "tue-5", startTime: "13:00", endTime: "13:50", subject: "Lunch" },
      { id: "tue-6", startTime: "14:00", endTime: "14:50", subject: "Software Engineering", teacher: "Dr. Gupta", room: "D-212" },
      { id: "tue-7", startTime: "15:00", endTime: "15:50", subject: "Data Structures", teacher: "Dr. Sharma", room: "E-201" }
    ]
  },
  {
    id: "wednesday-1",
    day: "Wednesday",
    batch_id: "1",
    slots: [
      { id: "wed-1", startTime: "08:00", endTime: "08:50", subject: "Computer Networks", teacher: "Dr. Kumar", room: "E-301" },
      { id: "wed-2", startTime: "09:00", endTime: "10:50", subject: "Data Structures Lab", teacher: "Dr. Sharma", room: "CS Lab" },
      { id: "wed-3", startTime: "11:00", endTime: "11:50", subject: "Break" },
      { id: "wed-4", startTime: "12:00", endTime: "12:50", subject: "Software Engineering", teacher: "Dr. Gupta", room: "D-212" },
      { id: "wed-5", startTime: "13:00", endTime: "13:50", subject: "Lunch" },
      { id: "wed-6", startTime: "14:00", endTime: "14:50", subject: "Discrete Mathematics", teacher: "Dr. Mathur", room: "E-101" },
      { id: "wed-7", startTime: "15:00", endTime: "15:50", subject: "Free" }
    ]
  },
  {
    id: "thursday-1",
    day: "Thursday",
    batch_id: "1",
    slots: [
      { id: "thu-1", startTime: "08:00", endTime: "09:50", subject: "Software Engineering Lab", teacher: "Dr. Gupta", room: "SE Lab" },
      { id: "thu-2", startTime: "10:00", endTime: "10:50", subject: "Data Structures", teacher: "Dr. Sharma", room: "E-201" },
      { id: "thu-3", startTime: "11:00", endTime: "11:50", subject: "Discrete Mathematics", teacher: "Dr. Mathur", room: "E-101" },
      { id: "thu-4", startTime: "12:00", endTime: "12:50", subject: "Computer Networks", teacher: "Dr. Kumar", room: "E-301" },
      { id: "thu-5", startTime: "13:00", endTime: "13:50", subject: "Lunch" },
      { id: "thu-6", startTime: "14:00", endTime: "15:50", subject: "Free" }
    ]
  },
  {
    id: "friday-1",
    day: "Friday",
    batch_id: "1",
    slots: [
      { id: "fri-1", startTime: "08:00", endTime: "08:50", subject: "Free" },
      { id: "fri-2", startTime: "09:00", endTime: "09:50", subject: "Digital Electronics", teacher: "Dr. Singh", room: "E-202" },
      { id: "fri-3", startTime: "10:00", endTime: "10:50", subject: "Software Engineering", teacher: "Dr. Gupta", room: "D-212" },
      { id: "fri-4", startTime: "11:00", endTime: "11:50", subject: "Data Structures", teacher: "Dr. Sharma", room: "E-201" },
      { id: "fri-5", startTime: "12:00", endTime: "12:50", subject: "Computer Networks", teacher: "Dr. Kumar", room: "E-301" },
      { id: "fri-6", startTime: "13:00", endTime: "13:50", subject: "Lunch" },
      { id: "fri-7", startTime: "14:00", endTime: "14:50", subject: "Digital Electronics", teacher: "Dr. Singh", room: "E-202" }
    ]
  }
];

export const classroomData = [
  { id: "1", name: "E-201", building: "E Block", floor: "2", capacity: 60 },
  { id: "2", name: "E-301", building: "E Block", floor: "3", capacity: 60 },
  { id: "3", name: "D-212", building: "D Block", floor: "2", capacity: 40 },
  { id: "4", name: "E-101", building: "E Block", floor: "1", capacity: 80 },
  { id: "5", name: "CS Lab", building: "Lab Complex", floor: "1", capacity: 30 },
  { id: "6", name: "Network Lab", building: "Lab Complex", floor: "2", capacity: 25 },
  { id: "7", name: "SE Lab", building: "Lab Complex", floor: "1", capacity: 30 },
  { id: "8", name: "Lecture Hall 1", building: "Main Building", floor: "G", capacity: 120 },
  { id: "9", name: "Auditorium", building: "Main Building", floor: "1", capacity: 500 },
  { id: "10", name: "Conference Room", building: "Admin Block", floor: "3", capacity: 20 }
];

export const bookingData = [
  {
    id: "1",
    roomId: "9",
    roomName: "Auditorium",
    purpose: "Annual Cultural Fest",
    society: "Cultural Society",
    date: "2023-11-15",
    startTime: "17:00",
    endTime: "21:00",
    status: "approved"
  },
  {
    id: "2",
    roomId: "10",
    roomName: "Conference Room",
    purpose: "Technical Workshop",
    society: "IEEE Student Branch",
    date: "2023-11-20",
    startTime: "14:00",
    endTime: "16:00",
    status: "pending"
  },
  {
    id: "3",
    roomId: "8",
    roomName: "Lecture Hall 1",
    purpose: "Guest Lecture",
    society: "Computer Science Society",
    date: "2023-11-25",
    startTime: "10:00",
    endTime: "12:00",
    status: "pending"
  }
];

export const batchData = [
  { id: "1", name: "COE1", year: 1, branch: "Computer Engineering", section: "A" },
  { id: "2", name: "COE2", year: 1, branch: "Computer Engineering", section: "B" },
  { id: "3", name: "ECE1", year: 1, branch: "Electronics Engineering", section: "A" },
  { id: "4", name: "ECE2", year: 1, branch: "Electronics Engineering", section: "B" },
  { id: "5", name: "ME1", year: 1, branch: "Mechanical Engineering", section: "A" },
  { id: "6", name: "COE1", year: 2, branch: "Computer Engineering", section: "A" },
  { id: "7", name: "COE2", year: 2, branch: "Computer Engineering", section: "B" },
  { id: "8", name: "ECE1", year: 2, branch: "Electronics Engineering", section: "A" }
];

export const teacherData = [
  {
    id: "1",
    name: "Dr. Sharma",
    department: "Computer Science",
    email: "sharma@thapar.edu",
    subjects: ["Data Structures", "Algorithms", "Programming Fundamentals"]
  },
  {
    id: "2",
    name: "Dr. Kumar",
    department: "Computer Science",
    email: "kumar@thapar.edu",
    subjects: ["Computer Networks", "Network Security", "Cloud Computing"]
  },
  {
    id: "3",
    name: "Dr. Gupta",
    department: "Computer Science",
    email: "gupta@thapar.edu",
    subjects: ["Software Engineering", "Project Management", "Web Development"]
    name"Dr. Gupta",
    department"Computer Science",
    email"gupta@thapar.edu",
    subjects["Software Engineering", "Project Management", "Web Development"]
  },
  {
    id"4",
    name"Dr. Singh",
    department"Electronics Engineering",
    email"singh@thapar.edu",
    subjects["Digital Electronics", "VLSI Design", "Embedded Systems"]
  },
  {
    id"5",
    name"Dr. Mathur",
    department"Mathematics",
    email"mathur@thapar.edu",
    subjects["Discrete Mathematics", "Linear Algebra", "Calculus"]
  }
];

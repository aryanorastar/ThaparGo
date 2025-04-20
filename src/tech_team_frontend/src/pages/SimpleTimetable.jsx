import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';

const SimpleTimetable = () => {
  // State for filters
  const [stream, setStream] = useState('');
  const [batch, setBatch] = useState('');
  const [year, setYear] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  // Filter options
  const streamOptions = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
  const batchOptions = ['A', 'B', 'C', 'D'];
  const yearOptions = ['1', '2', '3', '4'];

  // Static data for the timetable
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const timetableData = {
    'Monday': [
      { id: '1', time: '9:00 - 10:00', subject: 'Data Structures', teacher: 'Dr. Smith', room: 'L101', type: 'Lecture' },
      { id: '2', time: '10:00 - 11:00', subject: 'Algorithms', teacher: 'Dr. Johnson', room: 'L102', type: 'Lecture' },
      { id: '3', time: '11:00 - 12:00', subject: 'Database Systems', teacher: 'Prof. Williams', room: 'L103', type: 'Lab' },
      { id: '4', time: '12:00 - 1:00', subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      { id: '5', time: '1:00 - 2:00', subject: 'Computer Networks', teacher: 'Dr. Brown', room: 'L201', type: 'Lecture' }
    ],
    'Tuesday': [
      { id: '6', time: '9:00 - 10:00', subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'L202', type: 'Lecture' },
      { id: '7', time: '10:00 - 11:00', subject: 'Software Engineering', teacher: 'Prof. Miller', room: 'L203', type: 'Lecture' },
      { id: '8', time: '11:00 - 12:00', subject: 'Web Development', teacher: 'Dr. Wilson', room: 'L204', type: 'Lab' },
      { id: '9', time: '12:00 - 1:00', subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      { id: '10', time: '1:00 - 2:00', subject: 'Mobile App Development', teacher: 'Dr. Taylor', room: 'L205', type: 'Lab' }
    ],
    'Wednesday': [
      { id: '11', time: '9:00 - 10:00', subject: 'Computer Architecture', teacher: 'Dr. Anderson', room: 'L301', type: 'Lecture' },
      { id: '12', time: '10:00 - 11:00', subject: 'Artificial Intelligence', teacher: 'Dr. Thomas', room: 'L302', type: 'Lecture' },
      { id: '13', time: '11:00 - 12:00', subject: 'Machine Learning', teacher: 'Prof. Jackson', room: 'L303', type: 'Lab' },
      { id: '14', time: '12:00 - 1:00', subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      { id: '15', time: '1:00 - 2:00', subject: 'Deep Learning', teacher: 'Dr. White', room: 'L304', type: 'Lecture' }
    ],
    'Thursday': [
      { id: '16', time: '9:00 - 10:00', subject: 'Cybersecurity', teacher: 'Dr. Harris', room: 'L401', type: 'Lecture' },
      { id: '17', time: '10:00 - 11:00', subject: 'Cloud Computing', teacher: 'Dr. Martin', room: 'L402', type: 'Lecture' },
      { id: '18', time: '11:00 - 12:00', subject: 'Internet of Things', teacher: 'Prof. Thompson', room: 'L403', type: 'Lab' },
      { id: '19', time: '12:00 - 1:00', subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      { id: '20', time: '1:00 - 2:00', subject: 'Blockchain Technology', teacher: 'Dr. Garcia', room: 'L404', type: 'Lecture' }
    ],
    'Friday': [
      { id: '21', time: '9:00 - 10:00', subject: 'Quantum Computing', teacher: 'Dr. Martinez', room: 'L501', type: 'Lecture' },
      { id: '22', time: '10:00 - 11:00', subject: 'Data Science', teacher: 'Dr. Robinson', room: 'L502', type: 'Lecture' },
      { id: '23', time: '11:00 - 12:00', subject: 'Big Data Analytics', teacher: 'Prof. Clark', room: 'L503', type: 'Lab' },
      { id: '24', time: '12:00 - 1:00', subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      { id: '25', time: '1:00 - 2:00', subject: 'Natural Language Processing', teacher: 'Dr. Rodriguez', room: 'L504', type: 'Lecture' }
    ]
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    if (stream && batch && year) {
      setIsFiltered(true);
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setStream('');
    setBatch('');
    setYear('');
    setIsFiltered(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-gray-500">View your class schedule</p>
        </div>
        
        {/* Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Timetable</CardTitle>
            <CardDescription>Select your stream, batch, and year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                <Select value={stream} onValueChange={setStream}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {streamOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <Select value={batch} onValueChange={setBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={handleApplyFilters} className="flex-1">Apply Filters</Button>
                <Button onClick={handleResetFilters} variant="outline" className="flex-1">Reset</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Timetable Section */}
        {isFiltered ? (
          <Card>
            <CardHeader>
              <CardTitle>{stream} Engineering, Year {year}, Batch {batch}</CardTitle>
              <CardDescription>Weekly Schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="Monday">
                <TabsList className="grid grid-cols-5 mb-4">
                  {weekdays.map(day => (
                    <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
                  ))}
                </TabsList>
                
                {weekdays.map(day => (
                  <TabsContent key={day} value={day}>
                    <div className="space-y-4">
                      {timetableData[day].map(slot => (
                        <div 
                          key={slot.id} 
                          className={`flex justify-between items-center p-4 border rounded-md ${
                            slot.type === 'Break' 
                              ? 'bg-gray-50' 
                              : slot.type === 'Lab' 
                                ? 'bg-blue-50 border-l-4 border-blue-500' 
                                : 'bg-green-50 border-l-4 border-green-500'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{slot.subject}</div>
                            {slot.teacher && (
                              <div className="text-sm text-gray-600">
                                {slot.teacher} {slot.room && `• Room ${slot.room}`}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {slot.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-gray-500 mb-4">Please select your stream, batch, and year to view the timetable</div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimpleTimetable;

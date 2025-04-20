import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin } from 'lucide-react';

// Mock data for campus locations
const MOCK_LOCATIONS = [
  {
    id: 1,
    name: 'Main Building',
    type: 'academic',
    description: 'The main administrative and academic building',
    coordinates: [30.352, 76.368],
    floors: 5,
    departments: ['Administration', 'Computer Science', 'Electrical Engineering']
  },
  {
    id: 2,
    name: 'Library',
    type: 'academic',
    description: 'Central library with study spaces and resources',
    coordinates: [30.353, 76.369],
    floors: 3,
    departments: ['Library Services']
  },
  {
    id: 3,
    name: 'Student Center',
    type: 'facility',
    description: 'Student activities and recreation center',
    coordinates: [30.351, 76.367],
    floors: 2,
    departments: ['Student Affairs', 'Cafeteria']
  },
  {
    id: 4,
    name: 'Science Block',
    type: 'academic',
    description: 'Houses science departments and laboratories',
    coordinates: [30.354, 76.370],
    floors: 4,
    departments: ['Physics', 'Chemistry', 'Biology']
  },
  {
    id: 5,
    name: 'Hostel A',
    type: 'residence',
    description: 'Student residence hall for first-year students',
    coordinates: [30.350, 76.366],
    floors: 6,
    departments: ['Residence Life']
  },
  {
    id: 6,
    name: 'Sports Complex',
    type: 'facility',
    description: 'Indoor and outdoor sports facilities',
    coordinates: [30.355, 76.371],
    floors: 2,
    departments: ['Physical Education', 'Sports Teams']
  }
];

const CampusMap = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Campus Map</h1>
      <p className="text-lg mb-6">Interactive 3D map to help navigate the campus</p>
      
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Campus Map</CardTitle>
          <CardDescription>Interactive campus navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MapPin className="h-16 w-16 text-thapar-maroon mb-4" />
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-gray-500 max-w-md">
              Our interactive campus map with 3D visualization and IoT integration is under development.
              Check back soon for a better way to navigate the campus!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampusMap;
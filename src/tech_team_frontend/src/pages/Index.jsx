import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { MapPin, Calendar, Building, BookOpen, Users, ArrowRight, Info, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../providers/AuthProvider';

const Index = () => {
  const loading = false; // Database seeding is handled outside production code.
  const { user } = useAuth();

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-thapar-maroon" />,
      title: 'Campus Map',
      description: 'Interactive 3D map to help navigate the campus',
      link: '/map',
    },
    {
      icon: <Calendar className="h-8 w-8 text-thapar-blue" />,
      title: 'Timetable',
      description: 'View class schedules for different courses',
      link: '/timetable',
    },
    {
      icon: <Building className="h-8 w-8 text-purple-600" />,
      title: 'Classroom Finder',
      description: 'Find and check availability of classrooms',
      link: '/classrooms',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-amber-600" />,
      title: 'Room Bookings',
      description: 'Request rooms for society events and meetings',
      link: '/bookings',
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Societies Hub',
      description: 'Explore and join campus societies',
      link: '/societies',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-12 w-12 border-b-2 border-thapar-maroon mx-auto mb-4"></div>
            <p className="text-lg">Initializing application...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 text-thapar-maroon">
              Thapar Go
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Your all-in-one platform for navigating campus resources, managing schedules, and booking facilities.
            </p>
            
            {!user && (
              <div className="flex justify-center gap-4 mt-6">
                <Button asChild size="lg" className="bg-thapar-maroon hover:bg-thapar-maroon/90">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/map">Explore Campus</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index}>
                <Link to={feature.link} className="block h-full">
                  <Card className="h-full border-2 border-gray-200 overflow-hidden">
                    <CardHeader className="relative">
                      <div className="mb-2 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-700">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="relative pt-0">
                      <div className="flex items-center text-sm font-medium text-thapar-maroon">
                        Explore <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-16 mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="h-0.5 bg-gray-200 flex-grow"></div>
              <h2 className="text-2xl font-bold px-6 text-gray-800">About the Platform</h2>
              <div className="h-0.5 bg-gray-200 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-gray-100 mr-3">
                    <Info className="h-6 w-6 text-thapar-maroon" />
                  </div>
                  <h3 className="text-xl font-semibold text-thapar-maroon">For Students</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Find your way around campus with our interactive 3D map",
                    "View your class schedules and locations",
                    "Check classroom availability in real-time",
                    "Book rooms for student society events and meetings"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-1 text-thapar-maroon">•</div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-gray-100 mr-3">
                    <Lightbulb className="h-6 w-6 text-thapar-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-thapar-blue">For Faculty</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Access teaching schedules and classroom assignments",
                    "View and approve room booking requests",
                    "Find appropriate classrooms based on capacity and equipment",
                    "Navigate to different campus locations efficiently"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-1 text-thapar-blue">•</div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16 py-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Your complete campus navigation and scheduling solution for Thapar Institute of Engineering and Technology.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              2025 Thapar Go. All rights reserved.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;

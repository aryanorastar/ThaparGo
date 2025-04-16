
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Building, BookOpen } from 'lucide-react';
import { useDatabaseSeed } from '@/hooks/useDatabaseSeed';
import { motion } from 'framer-motion';

const Index = () => {
  const { loading } = useDatabaseSeed();

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-500" />,
      title: 'Campus Map',
      description: 'Interactive 3D map to help navigate the campus',
      link: '/map'
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Timetable',
      description: 'View class schedules for different courses',
      link: '/timetable'
    },
    {
      icon: <Building className="h-8 w-8 text-purple-500" />,
      title: 'Classroom Finder',
      description: 'Find and check availability of classrooms',
      link: '/classrooms'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-amber-500" />,
      title: 'Room Bookings',
      description: 'Request rooms for society events and meetings',
      link: '/bookings'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Initializing application...</p>
          </div>
        </div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-thapar-maroon to-purple-700">
              Campus Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your all-in-one platform for navigating campus resources, managing schedules, and booking facilities.
            </p>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Link to={feature.link}>
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-2 duration-300 border-2 hover:border-thapar-maroon/30">
                    <CardHeader>
                      <motion.div 
                        className="mb-2"
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-blue-500">Explore &rarr;</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">About the Campus Management System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-medium mb-3 text-thapar-maroon">For Students</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Find your way around campus with our interactive 3D map</li>
                  <li>View your class schedules and locations</li>
                  <li>Check classroom availability in real-time</li>
                  <li>Book rooms for student society events and meetings</li>
                </ul>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-medium mb-3 text-thapar-maroon">For Faculty</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access teaching schedules and classroom assignments</li>
                  <li>View and approve room booking requests</li>
                  <li>Find appropriate classrooms based on capacity and equipment</li>
                  <li>Navigate to different campus locations efficiently</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Index;

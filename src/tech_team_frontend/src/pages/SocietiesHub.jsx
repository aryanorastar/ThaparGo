import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

// Society logo URL
const SOCIETY_LOGO_URL = "https://edidmtoggnzkwvjtxtmo.supabase.co/storage/v1/object/sign/society_logos/8ee85e4b12c233233fcd37e3fa29e51f.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpZXR5X2xvZ29zLzhlZTg1ZTRiMTJjMjMzMjMzZmNkMzdlM2ZhMjllNTFmLmpwZyIsImlhdCI6MTc0NTE0NTY2MywiZXhwIjoyNjA5MTQ1NjYzfQ.EOMcHcQ87204f7VxGq7fY4LOQyCsBjXSlHv4gQGnl_k";

// Mock data for societies
const MOCK_SOCIETIES = [
  {
    id: '1',
    name: 'IEEE Student Branch',
    description: 'Technical society focused on electrical and electronics engineering',
    category: 'Technical',
    members: 120,
    events: 15,
    image: 'https://via.placeholder.com/150?text=IEEE',
    contact: 'ieee@thapar.edu'
  },
  {
    id: '2',
    name: 'OWASP Student Chapter',
    description: 'Cybersecurity and web application security community',
    category: 'Technical',
    members: 85,
    events: 8,
    image: 'https://via.placeholder.com/150?text=OWASP',
    contact: 'owasp@thapar.edu'
  },
  {
    id: '3',
    name: 'Literary Society',
    description: 'For literature enthusiasts and creative writers',
    category: 'Cultural',
    members: 95,
    events: 12,
    image: 'https://via.placeholder.com/150?text=LitSoc',
    contact: 'litsoc@thapar.edu'
  },
  {
    id: '4',
    name: 'Music Club',
    description: 'Platform for musicians and music enthusiasts',
    category: 'Cultural',
    members: 110,
    events: 20,
    image: 'https://via.placeholder.com/150?text=Music',
    contact: 'music@thapar.edu'
  },
  {
    id: '5',
    name: 'Sports Club',
    description: 'Promoting sports and physical fitness',
    category: 'Sports',
    members: 150,
    events: 25,
    image: 'https://via.placeholder.com/150?text=Sports',
    contact: 'sports@thapar.edu'
  },
  {
    id: '6',
    name: 'Photography Club',
    description: 'For photography enthusiasts and visual artists',
    category: 'Cultural',
    members: 75,
    events: 10,
    image: 'https://via.placeholder.com/150?text=PhotoClub',
    contact: 'photo@thapar.edu'
  }
];

/**
 * SocietiesHub Component
 * 
 * This component displays the Societies Hub page with a list of societies
 */
const SocietiesHub = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('societies')
          .select('*');
        
        if (error) {
          console.warn('Supabase error, using mock data:', error.message);
          setSocieties(MOCK_SOCIETIES);
          setLoading(false);
          return;
        }
        
        setSocieties(data || []);
        setLoading(false);
      } catch (error) {
        console.warn('Unexpected error, using mock data:', error);
        setSocieties(MOCK_SOCIETIES);
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const filteredSocieties = activeTab === 'all' 
    ? societies 
    : societies.filter(society => society.category.toLowerCase() === activeTab.toLowerCase());

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Societies Hub</h1>
        <p className="text-center py-10">Loading societies...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Societies Hub</h1>
      <p className="text-lg mb-6">Find and check the availability of societies across campus.</p>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Societies</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSocieties.map(society => (
          <Card key={society.id} className="overflow-hidden">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              <img 
                src={SOCIETY_LOGO_URL} 
                alt={society.name} 
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{society.name}</CardTitle>
              <CardDescription>{society.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{society.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{society.members} members</span>
                <span>{society.events} events</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button>Join Society</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocietiesHub;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp, MapPin, School, Home, Utensils, Building } from 'lucide-react';
import EnhancedThreeDMap from '../components/EnhancedThreeDMap';
import { supabase } from '../integrations/supabase/client';

const CampusMap = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [mapType, setMapType] = useState('3d');
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');
        
        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }
        
        // Convert coordinates from array to tuple
        const formattedLocations = data.map(location => ({
          ...location,
          coordinates: location.coordinates ? location.coordinates.coordinates : [0, 0]
        }));
        
        setLocations(formattedLocations);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleBuildingClick = (id) => {
    setSelectedBuildingId(id);
    setShowInfo(true);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const selectedBuilding = selectedBuildingId 
    ? locations.find(building => building.id === selectedBuildingId) 
    : null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Academic':
        return <School className="h-5 w-5 text-blue-500" />;
      case 'Residence':
        return <Home className="h-5 w-5 text-green-500" />;
      case 'Dining':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      default:
        return <Building className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 lg:px-6 py-8">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-thapar-maroon to-purple-700">Campus Map</h1>
      <p className="text-lg mb-8">Explore the campus with our interactive 3D map.</p>
      
      {/* Legend Section (moved above map, always visible) */}
      <div className="mb-6 w-full">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Campus Map Legend</CardTitle>
            <CardDescription>Understanding different building types and markers</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-2 min-w-[180px]">
                <span className="font-semibold text-gray-800">Academic</span>
                <div className="flex items-center gap-3 group hover:bg-blue-50 rounded p-1 transition">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base">A</div>
                  <span className="text-base text-gray-900">Academic Buildings</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[180px]">
                <span className="font-semibold text-gray-800">Residential</span>
                <div className="flex items-center gap-3 group hover:bg-green-50 rounded p-1 transition">
                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-base">R</div>
                  <span className="text-base text-gray-900">Residence Halls</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[180px]">
                <span className="font-semibold text-gray-800">Facilities</span>
                <div className="flex items-center gap-3 group hover:bg-orange-50 rounded p-1 transition">
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base">D</div>
                  <span className="text-base text-gray-900">Dining Facilities</span>
                </div>
                <div className="flex items-center gap-3 group hover:bg-purple-50 rounded p-1 transition">
                  <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-base">F</div>
                  <span className="text-base text-gray-900">Other Facilities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="content-wrapper grid lg:grid-cols-[70%_30%] gap-5 max-w-5xl mx-auto px-4">
        {/* Map Section */}
        <div className="map-section space-y-4">
          <div className="overflow-hidden max-h-[calc(100vh-250px)] rounded-lg mb-5">
            <div className="mb-4">
              <div className="pb-2">
                <h2 className="text-2xl font-semibold">Map View</h2>
                <span className="text-gray-500 text-sm">3D interactive campus view</span>
              </div>
              <div className="flex-1 flex flex-col">
                {/* Removed the Tabs since we're only using 3D view now */}
                <div className="w-full h-[450px]">
                  <EnhancedThreeDMap 
                    onBuildingClick={handleBuildingClick}
                    selectedBuildingId={selectedBuildingId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Section */}
        <div className="p-4 bg-white rounded-lg shadow-sm h-fit">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Building Directory</CardTitle>
              <input
                type="text"
                placeholder="Search buildings..."
                className="mt-2 w-full border rounded-md px-2 py-1 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search buildings"
              />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[500px] pr-2 p-4">
              <div className="space-y-2">
                {locations
                  .filter(location =>
                    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    location.type.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(location => (
                    <div
                      key={location.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        selectedBuildingId === location.id
                          ? 'bg-blue-100 border-l-4 border-blue-500'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleBuildingClick(location.id)}
                    >
                      <div className="flex items-center">
                        {getTypeIcon(location.type)}
                        <span className="ml-2 font-medium">{location.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-7">
                        {location.type}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: '#666' }}>
        ThaparGo &copy; 2025 by Aryan Gupta is licensed under 
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">
          Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
        </a>
      </footer>
    </div>
  );
};

export default CampusMap;
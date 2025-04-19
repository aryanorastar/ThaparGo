
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/map', label: 'Campus Map' },
    { path: '/timetable', label: 'Timetable' },
    { path: '/classrooms', label: 'Classrooms' },
    { path: '/bookings', label: 'Room Bookings' },
    { path: '/societies-hub', label: 'Societies Hub' },
  ];

  return (
    <header className="bg-thapar-maroon text-white shadow-md w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-xl md:text-2xl"
          >
            Thapar Go
          </motion.span>
        </Link>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            {isMenuOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}>
                <motion.div 
                  initial={{ x: 300 }}
                  animate={{ x: 0 }}
                  exit={{ x: 300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-0 h-full w-64 bg-white text-thapar-dark z-50 p-4 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end mb-6">
                    <Button variant="ghost" size="icon" onClick={toggleMenu}>
                      <X size={24} />
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                          location.pathname === item.path 
                            ? 'bg-thapar-maroon/10 text-thapar-maroon font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={toggleMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </motion.div>
              </div>
            )}
          </>
        ) : (
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="relative group"
              >
                <span className={`font-medium ${
                  location.pathname === item.path 
                    ? 'text-white' 
                    : 'text-gray-200 hover:text-white transition-colors duration-200'
                }`}>
                  {item.label}
                </span>
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute bottom-[-10px] left-0 right-0 h-[3px] bg-white rounded-full"
                  />
                )}
                <span className="absolute bottom-[-10px] left-0 right-0 h-[3px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

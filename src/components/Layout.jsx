
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import AuthHeader from './AuthHeader.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';
import { motion } from 'framer-motion';

const Layout = () => {
  const { loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-thapar-maroon to-thapar-maroon/90">
        <Header />
        <AuthHeader />
      </div>
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-thapar-maroon"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

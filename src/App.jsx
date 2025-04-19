import { Toaster } from "./components/ui/toaster.jsx.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx.jsx";
import NotFound from "./pages/NotFound.jsx.jsx";
import Layout from "./components/Layout.jsx.jsx";
import CampusMap from "./pages/CampusMap.jsx.jsx";
import Timetable from "./pages/Timetable.jsx.jsx";
import Classrooms from "./pages/Classrooms.jsx.jsx";
import RoomBookings from "./pages/RoomBookings.jsx.jsx";
import AdminBookings from "./pages/AdminBookings.jsx.jsx";
import SocietiesHub from "./pages/SocietiesHub.jsx.jsx";
import Auth from "./pages/Auth.jsx.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx.jsx";
import React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/map" element={<CampusMap />} />
                  <Route path="/timetable" element={<Timetable />} />
                  <Route path="/classrooms" element={<Classrooms />} />
                  <Route path="/bookings" element={
                    <ProtectedRoute>
                      <RoomBookings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/bookings" element={
                    <ProtectedRoute>
                      <AdminBookings />
                    </ProtectedRoute>
                  } />
                  <Route path="/societies-hub" element={<SocietiesHub />} />
                  <Route path="/auth" element={<Auth />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;

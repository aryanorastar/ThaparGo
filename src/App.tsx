import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import CampusMap from "./pages/CampusMap";
import Timetable from "./pages/Timetable";
import Classrooms from "./pages/Classrooms";
import RoomBookings from "./pages/RoomBookings";
import Auth from "./pages/Auth";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
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

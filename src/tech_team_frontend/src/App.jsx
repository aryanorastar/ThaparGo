import { Toaster } from './components/ui/toast.jsx';
import { SonnerToast } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Layout from "./components/Layout.jsx";
import CampusMap from "./pages/CampusMap.jsx";
import SimpleTimetable from "./pages/SimpleTimetable.jsx";
import Classrooms from "./pages/Classrooms.jsx";
import RoomBookings from "./pages/RoomBookings.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import SocietiesHub from "./pages/SocietiesHub.jsx";
import Auth from "./pages/Auth.jsx";
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
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <SonnerToast />
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/map" element={<CampusMap />} />
                <Route path="/timetable" element={<SimpleTimetable />} />
                <Route path="/classrooms" element={<Classrooms />} />
                <Route path="/bookings" element={<RoomBookings />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/societies" element={<SocietiesHub />} />
                <Route path="/auth" element={<Auth />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;

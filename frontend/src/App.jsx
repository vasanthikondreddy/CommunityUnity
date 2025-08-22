// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyEvents from './pages/Events';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';
import EventPage from './pages/EventPage';
import DashboardRedirect from './pages/DashboardRedirect';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EditEventForm from './pages/EditEventForm'; 
import EventForm from './components/Event/EventForm';
import Profile from './pages/Profile';

const socket = io('http://localhost:5000'); 

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('🟢 Connected to Socket.IO:', socket.id);
    });

    socket.on('newEvent', (eventData) => {
      console.log('📥 New event received:', eventData);
      
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from Socket.IO');
    });

    return () => {
      socket.off('connect');
      socket.off('newEvent');
      socket.off('disconnect');
    };
  }, []);

  return (
    <Router>
    
       <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events socket={socket} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/create-event" element={<CreateEvent socket={socket} />} />
        <Route path="/events/:eventId" element={<EventList />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="*" element={<div className="p-4 text-red-600">Page not found.</div>} />
        <Route path="/event-list" element={<EventList />} />
        <Route path="/events/edit/:id" element={<EditEventForm />} />
        <Route path="/create-event" element={<EventForm />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;

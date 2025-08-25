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
import MyEvents from './pages/Events'; // Consider renaming this import to avoid confusion
import EventList from './pages/EventList'; // If unused, you can remove later
import CreateEvent from './pages/CreateEvent';
import EventPage from './pages/EventPage';
import DashboardRedirect from './pages/DashboardRedirect';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EditEventForm from './pages/EditEventForm'; 
import EventForm from './components/Event/EventForm';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import ParticipantList from './pages/ParticipantsList';

const socket = io('http://localhost:5000'); 

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('🟢 Connected to Socket.IO:', socket.id);
    });

    socket.on('newEvent', (eventData) => {
      console.log('📥 New event received:', eventData);
      // You can add toast or state update here if needed
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


<Route path="/event/:eventId/participants" element={<ParticipantList />} />


        <Route path="/dashboard" element={<Dashboard><DashboardRedirect /></Dashboard>} />
<Route path="/user-dashboard" element={<UserDashboard />} />

        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/create-event" element={<CreateEvent socket={socket} />} />

  
       <Route path="/event-list" element={<Events socket={socket} />} />


        <Route path="/event/:eventId" element={<EventPage socket={socket} />} />

     <Route path="/edit-event/:id" element={<EditEventForm />} />


        {/* Consider removing one of these if duplicate */}
        <Route path="/event-list" element={<EventList />} />
        <Route path="/create-event" element={<EventForm />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div className="p-4 text-red-600">Page not found.</div>} />
      </Routes>
    </Router>
  );
}

export default App;

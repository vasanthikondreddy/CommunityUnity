import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
import UserDashboard from './pages/UserDashboard';
import ParticipantList from './pages/ParticipantsList';
import VolunteerCheckIn from './pages/VolunteerCheckIn';
import AnnouncementBoard from './pages/AnnoucementDashboard';
import VolunteersPage from './pages/VolunteersPage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboard from './pages/AdminDashboard';
import SelectEventPage from './pages/SelectiveEventPage';
import OrganizerLogisticsBoard from './pages/OrganizerLogisticsBoard';
import EventManagementPage from './pages/EventManagementPage';
import VolunteerTaskBoard from './pages/VolunteerTaskBoard';

import { socket } from "./utils/socket";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};
const footerTextStyle = { marginTop: '1rem', fontSize: '1rem' };
const linkStyle = { color: '#3b82f6', textDecoration: 'underline' };

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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events socket={socket} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/participants" element={<ParticipantList />} />
            <Route path="/dashboard" element={<Dashboard><DashboardRedirect /></Dashboard>} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/create-event" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <CreateEvent socket={socket} />
              </ProtectedRoute>
            } />
            <Route path="/event-list" element={<Events socket={socket} />} />
            <Route path="/event/:eventId" element={<EventPage socket={socket} />} />
            <Route path="/edit-event/:id" element={<EditEventForm />} />
            <Route path="/event-list" element={<EventList />} />
            <Route path="/create-event" element={<EventForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div className="text-center text-red-600 text-lg py-6">Page not found.</div>} />
            <Route path="/organizer" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/volunteer" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <VolunteerCheckIn />
              </ProtectedRoute>
            } />
            <Route path="/announcements" element={<AnnouncementBoard socket={socket} />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/logistics" element={<SelectEventPage />} />
            <Route path="/logistics/:eventId" element={
         
                <OrganizerLogisticsBoard />
              
            } />
            <Route path="/select-event" element={<SelectEventPage />} />
            <Route path="/dashboard/organizer" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/manage-event/:eventId" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <EventManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/my-tasks" element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <VolunteerTaskBoard />
              </ProtectedRoute>
            } />
<Route path="/unauthorized" element={
  <div className="text-center text-red-500 text-lg py-6">
    <p>Access denied...</p>
    <p style={footerTextStyle}>
      Just browsing?{' '}
      <Link to="/" style={linkStyle}>Go to Home</Link>
    </p>
  </div>
} />

          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;

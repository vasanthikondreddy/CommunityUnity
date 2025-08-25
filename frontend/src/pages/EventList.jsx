import React from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/Event/EventCard.jsx';

const EventList = ({ events, onDelete }) => {
  const safeEvents = Array.isArray(events) ? events : [];

  // ✅ Get user and role from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const userRole = localStorage.getItem('role');

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">📅 All Events</h2>

      {safeEvents.length === 0 ? (
        <p className="text-gray-500">No events to show.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              userRole={userRole}
              user={user} // ✅ Pass user object to EventCard
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Want to create an event directly?{' '}
        <Link to="/create-event" className="text-blue-600 hover:underline font-medium">
          Go to Event Creation
        </Link>
      </p>
      
      <p className="mt-2 text-center text-sm text-gray-600">
        Just browsing?{' '}
        <Link to="/" className="text-purple-600 hover:underline font-medium">
          Go to Home
        </Link>
      </p>
   
    </div>
  );
};

export default EventList;

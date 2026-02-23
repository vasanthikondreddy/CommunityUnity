import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import EventCard from '../components/Event/EventCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const MemberDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMine, setShowOnlyMine] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    axios.get(`${API_BASE}/events`)
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        toast.error('Failed to load events');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const organizerId = typeof event.organizer === 'object'
        ? event.organizer._id
        : event.organizer;

      const isOrganizer = user?._id === organizerId;
      const isSignedUp = event.signups?.some(s => s.user_id === user?._id);

      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());

      if (showOnlyMine) {
        return (isOrganizer || isSignedUp) && matchesSearch;
      } else {
        return matchesSearch;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, showOnlyMine]);

  const handleSignup = async (eventId) => {
    try {
      await axios.post(`${API_BASE}/events/${eventId}/signup`, { userId: user._id });
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? { ...event, signups: [...(event.signups || []), { user_id: user._id }] }
            : event
        )
      );
      toast.success('Signed up successfully!');
    } catch (err) {
      console.error('Signup failed:', err);
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event Dashboard</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search events by title..."
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button
          className={`px-4 py-2 rounded transition transform hover:scale-[1.02] ${
            showOnlyMine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setShowOnlyMine(prev => !prev)}
        >
          {showOnlyMine ? 'Showing: My Events' : 'Showing: All Events'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Loading events...</p>
      ) : filteredEvents.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map(event => {
            const organizerId = typeof event.organizer === 'object'
              ? event.organizer._id
              : event.organizer;

            const isOrganizer = user?._id === organizerId;
            const isSignedUp = event.signups?.some(s => s.user_id === user?._id);

            return (
              <EventCard
                key={event._id}
                event={event}
                userRole={user?.role}
                isOrganizer={isOrganizer}
                isSignedUp={isSignedUp}
                onSignup={handleSignup}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">No events match your criteria.</p>
      )}
    </div>
  );
};

export default MemberDashboard;

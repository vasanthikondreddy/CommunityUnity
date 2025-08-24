// src/pages/Events.jsx
import React, { useEffect, useState } from 'react';
import EventList from './EventList.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Events = ({ socket }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userRole = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE}/events`);
        const result = await response.json();

        // ✅ Access result.data instead of result
        if (response.ok && Array.isArray(result.data)) {
          setEvents(result.data);
          setFilteredEvents(result.data);
        } else {
          console.error('Unexpected response:', result);
          setError('Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Listen for new events via socket
  useEffect(() => {
    if (!socket) return;

    socket.on('newEvent', (newEvent) => {
      setEvents(prev => [newEvent, ...prev]);
      setFilteredEvents(prev => [newEvent, ...prev]);
    });

    return () => {
      socket.off('newEvent');
    };
  }, [socket]);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(event => event._id !== id));
    setFilteredEvents(prev => prev.filter(event => event._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 All Events</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border px-4 py-2 rounded shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-gray-500">No matching events found.</p>
      ) : (
        <EventList
          events={filteredEvents}
          userRole={userRole}
          user={user}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Events;

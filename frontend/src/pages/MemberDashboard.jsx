
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/Event/EventCard';

const MemberDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/events') 
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events available right now.</p>
      )}
    </div>
  );
};

export default MemberDashboard;

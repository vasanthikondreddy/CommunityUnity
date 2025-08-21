import React, { useEffect, useState } from 'react';
import socket from '../services/socket'; 
import EventCard from '../components/Event/EventCard';
import EventForm from '../components/Event/EventForm';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Expected array, got:', data);
          setEvents([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   socket.on('newEvent', newEvent => {
  //     setEvents(prev => Array.isArray(prev) ? [...prev, newEvent] : [newEvent]);
  //   });
  useEffect(() => {
  socket.on("newEvent", (event) => {
    setEvents((prevEvents) => [event, ...prevEvents]);
  });

    return () => {
      socket.off('newEvent');
    };
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="px-4 py-6">
      <EventForm />

      <div className="event-list mt-6">
        {Array.isArray(events) && events.length > 0 ? (
          events.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;

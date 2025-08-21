import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL); 

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/events`)
      .then(res => setEvents(res.data))
      .catch(err => console.error('Error fetching events:', err));

  
    socket.on('newEvent', (event) => {
      setEvents(prev => [event, ...prev]); 
    });

    return () => {
      socket.off('newEvent');
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event._id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            <p className="mt-2">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;

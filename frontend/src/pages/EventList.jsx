// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// 

// const EventList = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     fetch(`${API_BASE}/events`)
//       .then(res => res.json())
//       .then(data => setEvents(data))
//       .catch(err => console.error('Error fetching events:', err));
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
//       {events.length === 0 ? (
//         <p>No events found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {events.map(event => (
//             <li key={event._id} className="border p-4 rounded shadow">
//               <h3 className="text-xl font-semibold">{event.title}</h3>
//               <p>{event.description}</p>
//               <p className="text-sm text-gray-500">
//                 📅 {new Date(event.date).toLocaleDateString()}
//               </p>
//               <Link to={`/event/${event._id}`} className="text-blue-600 underline">
//                 View Details
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

import { useState, useEffect } from 'react';
import EventCard from '../components/Event/EventCard';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const filteredEvents = filter
    ? events.filter(e => e.category === filter)
    : events;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Browse Events</h2>

      <select
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        <option value="">All Categories</option>
        <option value="cleanup">Cleanup</option>
        <option value="teaching">Teaching</option>
        <option value="awareness">Awareness</option>
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}

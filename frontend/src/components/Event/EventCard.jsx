import React from 'react';

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
      <p className="text-gray-600 mb-1">{event.description}</p>
      <p className="text-sm text-gray-500">
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
    </div>
  );
};

export default EventCard;

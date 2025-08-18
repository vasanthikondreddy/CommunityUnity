import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date }),
      });
      if (res.ok) {
        navigate('/');
      } else {
        alert('Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

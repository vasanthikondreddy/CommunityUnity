import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const organizerId = localStorage.getItem('userId');

    if (!organizerId || organizerId === 'undefined') {
      setMessage('❌ Organizer ID missing. Please log in again.');
      setSubmitting(false);
      return;
    }

    const isValidDate = !isNaN(new Date(formData.date).getTime());
    if (!isValidDate) {
      setMessage("❌ Invalid date format. Please use the calendar picker.");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      date: formData.date,
      organizer: organizerId
    };

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      setFormData({ name: '', description: '', date: '' });
      setMessage('✅ Event created successfully!');
    } catch (err) {
      console.error('❌ Error creating event:', err.message);
      setMessage(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>

      <input
        type="text"
        name="name"
        placeholder="Event Title"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Event Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {submitting ? 'Submitting...' : 'Create Event'}
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </form>
  );
};

export default EventForm;

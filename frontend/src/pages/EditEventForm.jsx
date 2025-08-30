import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    axios.get(`/api/events/${id}`)
      .then(res => {
        const event = res.data.data;
        setFormData({
          title: event.title,
          description: event.description,
          date: event.date.slice(0, 10),
          location: event.location,
        });
      })
      .catch(err => console.error('Error loading event:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/events/${id}`, formData);
      alert('Event updated successfully');
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">✏️ Edit Event</h2>

      <label className="block mb-2">Title</label>
      <input name="title" value={formData.title} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

      <label className="block mb-2">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

      <label className="block mb-2">Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

      <label className="block mb-2">Location</label>
      <input name="location" value={formData.location} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">💾 Save Changes</button>
    </form>
  );
};

export default EditEventForm;

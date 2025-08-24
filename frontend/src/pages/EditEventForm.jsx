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
      navigate('/dashboard'); // or wherever you want to redirect
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-event-form">
      <h2>Edit Event</h2>
      <label>Title</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <label>Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />

      <label>Location</label>
      <input name="location" value={formData.location} onChange={handleChange} required />

      <button type="submit" className="btn btn-save">💾 Save Changes</button>
    </form>
  );
};

export default EditEventForm;

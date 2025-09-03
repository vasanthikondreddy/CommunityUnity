import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const socket = io(API_BASE, {
  transports: ['websocket'], // or ['websocket', 'polling']
  withCredentials: true,
});

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    organizer: '',
    file: null,
  });

  useEffect(() => {
    socket.on('newEvent', (event) => {
      toast(`📢 New event posted: ${event.title}`, {
        icon: '📅',
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      });
    });

    return () => socket.off('newEvent');
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (!res.ok || !json.success) throw new Error('Event creation failed');

      toast.success('🎉 Event created successfully!');
      console.log('Event created:', json);

      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        organizer: '',
        file: null,
      });
    } catch (err) {
      toast.error('❌ Failed to create event');
      console.error('Create event error:', err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📅 Create a New Event</h2>
      <p style={subtextStyle}>
        Fill in the details below to publish your event and share it with the community.
      </p>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="title" placeholder="🎉 Title" value={formData.title} onChange={handleChange} style={inputStyle} />
        <input name="description" placeholder="📝 Description" value={formData.description} onChange={handleChange} style={inputStyle} />
        <input name="date" type="date" value={formData.date} onChange={handleChange} style={inputStyle} />
        <input name="location" placeholder="📍 Location" value={formData.location} onChange={handleChange} style={inputStyle} />
        <input name="organizer" placeholder="👤 Organizer" value={formData.organizer} onChange={handleChange} style={inputStyle} />
        <input name="file" type="file" onChange={handleChange} style={inputStyle} />

        {formData.file && (
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            📎 Selected file: {formData.file.name}
          </p>
        )}

        <button type="submit" style={buttonStyle}>
          🚀 Create Event
        </button>
      </form>

      <p style={footerTextStyle}>
        Just browsing?{' '}
        <Link to="/" style={linkStyle}>
          Go to Home
        </Link>
      </p>
    </div>
  );
}


const containerStyle = {
  maxWidth: '500px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const headingStyle = {
  fontSize: '1.8rem',
  marginBottom: '0.5rem',
};

const subtextStyle = {
  marginBottom: '1.5rem',
  color: '#555',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
  width: '100%',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};

const footerTextStyle = {
  marginTop: '1rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#666',
};

const linkStyle = {
  color: '#6b46c1',
  textDecoration: 'underline',
  fontWeight: '500',
};

export default CreateEvent;

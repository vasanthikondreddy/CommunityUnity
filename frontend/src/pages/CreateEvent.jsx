import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { Link, useNavigate } from 'react-router-dom';
import { socket } from "../utils/socket";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function CreateEvent() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    file: null,
    organizer: '',
  });

useEffect(() => {
  const storedUserId = localStorage.getItem('userId');
  const storedRole = localStorage.getItem('role');

  console.log('✅ Stored userId:', storedUserId);
  console.log('✅ Stored role:', storedRole);

  if (!storedUserId || !storedRole || storedRole.trim().toLowerCase() !== 'organizer') {
    toast.error('🔒 Please log in as an organizer to create events');
    navigate('/login');
    return;
  }

  setUserId(storedUserId);
  setRole(storedRole.trim().toLowerCase());
  setIsAuthorized(true);

  setFormData((prev) => ({
    ...prev,
    organizer: storedUserId,
  }));

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
}, [navigate]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthorized) {
      toast.error('🚫 Only organizers can create events');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('⏱️ End time must be after start time');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || 'Event creation failed');

      toast.success('🎉 Event created successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        file: null,
        organizer: userId,
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
        {isAuthorized
          ? 'Fill in the details below to publish your event and share it with the community.'
          : 'Only organizers can create events. Please contact admin if you need access.'}
      </p>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="title" placeholder="🎉 Title" value={formData.title} onChange={handleChange} style={inputStyle} required />
        <textarea name="description" placeholder="📝 Description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: '100px' }} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} style={inputStyle} required />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input name="startTime" type="time" value={formData.startTime} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} required />
          <input name="endTime" type="time" value={formData.endTime} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} required />
        </div>
        <input name="location" placeholder="📍 Location" value={formData.location} onChange={handleChange} style={inputStyle} required />
        <input name="file" type="file" onChange={handleChange} style={inputStyle} />

        {formData.file && (
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            📎 Selected file: {formData.file.name}
          </p>
        )}

        {isAuthorized && (
          <button type="submit" style={buttonStyle}>
            🚀 Create Event
          </button>
        )}
      </form>

      <p style={footerTextStyle}>
        Just browsing?{' '}
        <Link to="/" style={linkStyle}>
          Go to Home
        </Link>
        
      </p>
      <p style={footerTextStyle}>
        Do You want to view Event ?{' '}
      <Link to="/my-events" style={linkStyle}>
  View My Events
</Link>
     </p> 
    </div>
  );
}

// 🎨 Styling
const containerStyle = {
  maxWidth: '600px',
  margin: '3rem auto',
  padding: '2rem',
  background: 'linear-gradient(to right, #f0f4ff, #e0e7ff)',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
};

const headingStyle = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
  color: '#333',
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
  borderRadius: '6px',
  fontSize: '1rem',
  width: '100%',
  backgroundColor: '#fff',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
};

const footerTextStyle = {
  marginTop: '1rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#666',
};

const linkStyle = {
  color: '#4f46e5',
  textDecoration: 'underline',
  fontWeight: '500',
};

export default CreateEvent;

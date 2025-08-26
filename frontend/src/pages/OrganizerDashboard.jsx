import React, { useEffect } from 'react';
import AnnouncementBoard from './AnnoucementDashboard';
import VolunteerCheckIn from './VolunteerCheckIn';
import { useNavigate } from 'react-router-dom';

function OrganizerDashboard({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'organizer') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <h2 style={styles.heading}>🔄 Loading Organizer Dashboard...</h2>
        <p style={styles.subheading}>Please wait while we verify your access.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛠️ Organizer Dashboard</h2>
      <p style={styles.subheading}>
        Welcome, <strong>{user.name || 'Organizer'}</strong>! Manage your announcements and volunteer check-ins below.
      </p>

      <section style={styles.section}>
        <AnnouncementBoard />
      </section>

      <section style={styles.section}>
        <VolunteerCheckIn />
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  loadingContainer: {
    maxWidth: '600px',
    margin: '4rem auto',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fffbe6',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subheading: {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#666',
  },
  section: {
    marginBottom: '2rem',
  },
};

export default OrganizerDashboard;

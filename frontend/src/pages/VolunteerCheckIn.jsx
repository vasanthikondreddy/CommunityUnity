import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function VolunteerCheckIn() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/volunteers`)
      .then((res) => res.json())
      .then((data) => {
        setVolunteers(data.volunteers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching volunteers:', err);
        setError('Failed to load volunteers');
        setLoading(false);
      });
  }, []);

  const handleCheckIn = async (volunteerId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/volunteers/${volunteerId}/checkin`, {
        method: 'PUT',
      });

      setVolunteers((prev) =>
        prev.map((v) =>
          v._id === volunteerId ? { ...v, checkedIn: true } : v
        )
      );

      toast.success('✅ Volunteer checked in!');
    } catch (err) {
      console.error('Check-in failed:', err);
      toast.error('❌ Check-in failed. Please try again.');
    }
  };

  const filteredVolunteers = volunteers.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>✅ Volunteer Check-In</h3>

      <input
        type="text"
        placeholder="🔍 Search volunteers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {loading && <p>⏳ Loading volunteers...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      <ul style={styles.list}>
        {filteredVolunteers.map((v) => (
          <li key={v._id} style={styles.item}>
            <span>{v.name}</span>
            {v.checkedIn ? (
              <span style={styles.status}>✅ Checked In</span>
            ) : (
              <button onClick={() => handleCheckIn(v._id)} style={styles.button}>
                Check In
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#fefefe',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  search: {
    padding: '0.5rem',
    marginBottom: '1rem',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
  },
  button: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  status: {
    color: '#28a745',
    fontWeight: 'bold',
  },
};

export default VolunteerCheckIn;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  transports: ['websocket'],
});

function AnnouncementBoard() {
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    socket.on('newAnnouncement', (msg) => {
      const time = new Date().toLocaleTimeString();
      setAnnouncements((prev) => [{ msg, time }, ...prev]);

      toast(`📢 ${msg}`, {
        icon: '📣',
        style: {
          borderRadius: '8px',
          background: '#222',
          color: '#fff',
        },
      });
    });

    return () => socket.off('newAnnouncement');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    socket.emit('postAnnouncement', announcement.trim());
    setAnnouncement('');
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📣 Announcement Board</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Type your announcement..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>📤 Post</button>
      </form>

      <ul style={styles.list}>
        {announcements.map(({ msg, time }, idx) => (
          <li key={idx} style={styles.item}>
            <span>🗨️ {msg}</span>
            <span style={styles.timestamp}>{time}</span>
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
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
    fontSize: '1rem',
    color: '#444',
    display: 'flex',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: '0.85rem',
    color: '#888',
  },
};

export default AnnouncementBoard;

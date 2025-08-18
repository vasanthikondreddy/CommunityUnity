    import React, { useEffect, useState } from 'react';

    const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/events`)
        .then(res => res.json())
        .then(data => {
            console.log('Fetched events:', data);
            setEvents(data);
        })
        .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <div>
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
            <p>No events found.</p>
        ) : (
            <ul>
            {events.map(event => (
                <li key={event._id}>
                <strong>{event.name}</strong> — {new Date(event.date).toLocaleString()} @ {event.location}
                <br />
                <em>{event.description}</em>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    };

    export default EventList;

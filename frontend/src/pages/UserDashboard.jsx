import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${user._id}/joined-events`)
      .then(res => res.json())
      .then(data => setJoinedEvents(data
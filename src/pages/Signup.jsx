import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phone: e.target.phone.value,
      location: e.target.location.value,
      interests: e.target.interests.value,
      role: e.target.role.value,
      availability: e.target.availability.value,
    };

    try {
      await handleRegister(formData);
      navigate('/login', { state: { message: 'Account created! Please log in.' } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Your CommunityUnity Account</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <input name="name" placeholder="Full Name" required className="w-full mb-3 p-2 border rounded" />
      <input name="email" type="email" placeholder="Email" required className="w-full mb-3 p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" required className="w-full mb-3 p-2 border rounded" />
      <input name="phone" placeholder="Phone Number" className="w-full mb-3 p-2 border rounded" />
      <input name="location" placeholder="Location (City/Region)" className="w-full mb-3 p-2 border rounded" />
      <textarea name="interests" placeholder="Your interests (e.g. teaching, cleanup)" className="w-full mb-3 p-2 border rounded" />
      
      <select name="role" className="w-full mb-3 p-2 border rounded">
        <option value="member">Member</option>
        <option value="organizer">Organizer</option>
        <option value="admin">Admin</option>
      </select>

      <select name="availability" className="w-full mb-4 p-2 border rounded">
        <option value="weekdays">Weekdays</option>
        <option value="weekends">Weekends</option>
        <option value="flexible">Flexible</option>
      </select>

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Sign Up
      </button>
    </form>
  );
}

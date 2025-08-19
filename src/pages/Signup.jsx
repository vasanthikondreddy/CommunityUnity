import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Signup() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value.trim(),
      email: e.target.email.value.trim(),
      password: e.target.password.value,
      phone: e.target.phone.value.trim() || 'Not provided',
      location: e.target.location.value.trim() || 'Unknown',
      interests: e.target.interests.value.trim()
        ? e.target.interests.value.trim().split(',').map(i => i.trim())
        : [],
      role: e.target.role.value.toLowerCase(),
      availability: e.target.availability.value,
    };

    console.log("Submitting form data:", formData); 

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

      {location.state?.message && (
        <p className="text-blue-600 text-sm mb-4 text-center">{location.state.message}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <input name="name" placeholder="Full Name" required className="w-full mb-3 p-2 border rounded" />
      <input name="email" type="email" placeholder="Email" required className="w-full mb-3 p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" required className="w-full mb-3 p-2 border rounded" />
      <input name="phone" placeholder="Phone Number" className="w-full mb-3 p-2 border rounded" />
      <input name="location" placeholder="Location (City/Region)" className="w-full mb-3 p-2 border rounded" />
      <textarea name="interests" placeholder="Your interests (e.g. teaching, cleanup)" className="w-full mb-3 p-2 border rounded" />

      <select name="role" defaultValue="" required className="w-full mb-3 p-2 border rounded">
        <option value="" disabled>Select Role</option>
        <option value="member">Member</option>
        <option value="organizer">Organizer</option>
        <option value="admin">Admin</option>
      </select>

      <select name="availability" defaultValue="" required className="w-full mb-4 p-2 border rounded">
        <option value="" disabled>Select Availability</option>
        <option value="weekdays">Weekdays</option>
        <option value="weekends">Weekends</option>
        <option value="flexible">Flexible</option>
      </select>

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
        Sign Up
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline font-medium">Log in here</a>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        Just browsing?{' '}
        <Link to="/" className="text-purple-600 hover:underline font-medium">Go to Home</Link>
      </p>
    </form>
  );
}

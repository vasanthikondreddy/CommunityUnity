import React from 'react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || null;

  if (!user) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">No user logged in</h2>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Profile</h2>
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.avatarUrl || 'https://i.pravatar.cc/150?u=default'}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-blue-600"
        />
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p><span className="font-semibold">Role:</span> {user.role}</p>
        
      </div>
    </div>
  );
}

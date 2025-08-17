// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const auth = useAuth();

  if (!auth) return <p>Auth context not available</p>;

  const { user, logout } = auth;

  return (
    <div>
      <h1>Welcome, {user?.name || "User"}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

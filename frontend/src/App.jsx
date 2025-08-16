import React, { useState } from "react";
import { useAuth } from "./context/AuthContext"; 
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 
import Dashboard from "./pages/Dashboard"; 

export default function App() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (user) return <Dashboard />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {showSignup ? <Signup /> : <Login />}
      <button
        onClick={() => setShowSignup(!showSignup)}
        className="mt-4 text-blue-600 hover:underline"
      >
        {showSignup ? "Already have an account? Login" : "New here? Sign up"}
      </button>
    </div>
  );
}

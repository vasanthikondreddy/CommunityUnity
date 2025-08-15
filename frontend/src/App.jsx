import React from "react";
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard"; 

export default function App() {
  const user = true; 

  return (
    <div>
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

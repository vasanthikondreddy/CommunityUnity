import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleRegister = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
    } catch (err) {
      console.error('Signup error:', err.message);
      throw err;
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
    } catch (err) {
      console.error('Login error:', err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid token format');

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        setUser({ email: payload.email, role: payload.role });
      } catch (err) {
        console.error('Token decode error:', err.message);
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './Admin';
import UserDashboard from './UserDashboard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user:", err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}

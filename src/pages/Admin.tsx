import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('angla_admin_auth') === 'true';
    setIsAuthenticated(auth);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#06030e] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
};

export default Admin;

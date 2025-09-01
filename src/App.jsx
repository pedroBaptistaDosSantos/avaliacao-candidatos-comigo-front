import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { authService } from './services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      const userData = authService.getUser();
      
      if (token && userData && authService.isAuthenticated()) {
        setUser(userData);
      } else {
        // Token inválido ou expirado - limpa os dados
        authService.logout();
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    authService.setAuthData(userData, token);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
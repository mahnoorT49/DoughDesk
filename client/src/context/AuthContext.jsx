import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

// Any component can call useAuth() to get { user, loading, login, register, logout }
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Start in "loading" only if a saved token exists, because we then have to check it
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'));

  // On page load: if a token exists, ask the server who the user is
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null); // ProtectedRoute then sends the user to /login
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
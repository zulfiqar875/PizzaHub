import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api('/me.php').then(d => { setUser(d.user || null); setReady(true); })
                  .catch(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    await api('/login.php', { method: 'POST', body: JSON.stringify({ email, password }) });
    const d = await api('/me.php');
    setUser(d.user || null);
  };

  const logout = async () => {
    await api('/logout.php');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

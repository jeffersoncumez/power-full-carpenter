import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Al iniciar sesión
  const login = (data) => {
    setUser({
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    setToken(data.token);

    // Guardar en localStorage
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: {
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        token: data.token,
      })
    );
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  // Rehidratar al cargar la app
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { user, token } = JSON.parse(storedAuth);
        setUser(user);
        setToken(token);
      } catch (err) {
        console.error('Error leyendo auth en localStorage', err);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);

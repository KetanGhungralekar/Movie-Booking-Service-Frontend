import { createContext, useEffect, useState } from 'react';
import { apiUrl, USERS_ME } from './global/connect';
import { getToken, clearToken } from './auth';

export const MyContext = createContext();

function AppContext({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(apiUrl(USERS_ME), {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setUser(data))
      .catch(() => {
        // If token invalid/expired, clear it
        clearToken();
        setUser(null);
      });
  }, []);

  return (
    <MyContext.Provider value={{ user, setUser }}>
      {children}
    </MyContext.Provider>
  );
}

export default AppContext;
const API_BASE_URL = 'http://localhost:5000/api';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({ user: null, setUser: () => { } });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, method, data = null, token = getToken()) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const get = (endpoint, token) => request('GET', endpoint, null, token);
export const post = (endpoint, data, token) => request('POST', endpoint, data, token);
export const put = (endpoint, data, token) => request('PUT', endpoint, data, token);
export const del = (endpoint, token) => request('DELETE', endpoint, null, token);
import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  //getRole returns the isAdmin value (true if staff, false if tenant).
  //To be used for conditional rendering as needed.
  const getRole = () => {
    const roleString = localStorage.getItem('token');
    const userRole = JSON.parse(roleString);
    return userRole?.isAdmin;
  }

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    setToken: saveToken,
    removeToken,
    getRole,
    token
  }
}
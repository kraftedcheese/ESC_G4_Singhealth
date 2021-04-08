import { useState } from 'react';

export default function useUser() {
  const getUser = () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    return user
  };

  const [user, setUser] = useState(getUser());

  const saveUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const removeUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    setUser: saveUser,
    removeUser,
    user
  }
}
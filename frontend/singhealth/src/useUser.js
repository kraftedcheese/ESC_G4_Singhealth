import { useState } from 'react';

export default function useUser() {
  const getUser = () => {
    const userString = localStorage.getItem('user');
    const userJson = JSON.parse(userString);
    return userJson
  };

  const [user, setUser] = useState(getUser());

  const saveUser = user => {
    localStorage.setItem('user', JSON.stringify(user[0]));
    setUser(user[0]);
  };

  const removeUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    setUser: saveUser,
    removeUser,
    user,
    getUser
  }
}
import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';
import metroImage from './assets/toshkent-metropoliteni-tashkent-metro-533863.jpg';
import './App.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) onLogin();
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('token/', { username, password });
      const accessToken = res.data.access;
      localStorage.setItem('access', accessToken);

      const userRes = await axios.get('me/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      localStorage.setItem('is_superuser', userRes.data.is_superuser);
      localStorage.setItem('username', userRes.data.username);

      onLogin();
    } catch (error) {
      alert('Login muvaffaqiyatsiz!');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <img src={metroImage} alt="Metropoliten" className="logo" />
      <h2 className="title">Kirish</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Kirish</button>
    </form>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8020/api/token/', {
        username,
        password,
      });

      const accessToken = res.data.access;
      localStorage.setItem('access', accessToken);

      // 🔁 Superuser yoki oddiy user ekanini aniqlash
    const userRes = await axios.get('http://localhost:8020/api/me/', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
      // 🧠 Kerakli user ma'lumotini saqlab qo'yish
      localStorage.setItem('is_superuser', userRes.data.is_superuser);
      localStorage.setItem('username', userRes.data.username);

      // 🔓 Kirganini App.jsx ga xabar berish
      onLogin();

    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="title">Administrator Kirish</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Kirish</button>
    </form>
  );
}

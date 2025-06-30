import React, { useState } from 'react';
import axios from './axiosInstance';

export default function AddLineForm() {
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // <-- bu GETni to‘xtatadi
    try {
      const response = await axios.post('lines/', { name_uz: name });
      console.log('Yaratildi:', response.data);
      setSuccess(true);
      setError(null);
      setName('');
    } catch (err) {
      console.error('Xatolik:', err);
      setError('Saqlashda xatolik yuz berdi');
      setSuccess(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Yangi liniya qo‘shish</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Nomi:</label>
        <input
          type="text"
          placeholder="Liniya nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="form-button" type="submit">Saqlash</button>
        {success && <p style={{ color: 'green' }}>✅ Saqlandi!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

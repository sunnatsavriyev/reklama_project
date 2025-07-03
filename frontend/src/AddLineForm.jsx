import React, { useState } from 'react';
import axios from './axiosInstance';

export default function AddLineForm() {
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('lines/', {
        name_uz: nameUz,
        name_ru: nameRu
      });
      console.log('Yaratildi:', response.data);
      setSuccess(true);
      setError(null);
      setNameUz('');
      setNameRu('');
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
        <label>Liniya nomi (UZ):</label>
        <input
          type="text"
          placeholder="Liniya nomi (uz)"
          value={nameUz}
          onChange={(e) => setNameUz(e.target.value)}
          required
        />
        <label>Liniya nomi (RU):</label>
        <input
          type="text"
          placeholder="Liniya nomi (ru)"
          value={nameRu}
          onChange={(e) => setNameRu(e.target.value)}
          required
        />
        <button className="form-button" type="submit">Saqlash</button>
        {success && <p style={{ color: 'green' }}>✅ Saqlandi!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

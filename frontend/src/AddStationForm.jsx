import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';
import './App.css';

export default function AddStationForm() {
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [lineId, setLineId] = useState('');
  const [lines, setLines] = useState([]);
  const [schemaImage, setSchemaImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    axios.get('lines/')
      .then(res => setLines(res.data))
      .catch(err => console.error('Liniyalarni olishda xatolik:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lineId || !nameUz || !nameRu) {
      setMessage({ type: 'error', text: "Barcha maydonlarni to‘ldiring!" });
      return;
    }

    const formData = new FormData();
    formData.append('name_uz', nameUz);
    formData.append('name_ru', nameRu);
    formData.append('line', lineId);
    if (schemaImage) {
      formData.append('schema_image', schemaImage);
    }

    try {
      setIsSubmitting(true);
      await axios.post('stations/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: "✅ Bekat muvaffaqiyatli qo‘shildi!" });
      setNameUz('');
      setNameRu('');
      setLineId('');
      setSchemaImage(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "❌ Bekat qo‘shishda xatolik yuz berdi!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Bekat qo‘shish</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Bekat nomi (UZ):</label>
        <input type="text" value={nameUz} onChange={e => setNameUz(e.target.value)} required />

        <label>Bekat nomi (RU):</label>
        <input type="text" value={nameRu} onChange={e => setNameRu(e.target.value)} required />

        <label>Liniya tanlang:</label>
        <select value={lineId} onChange={e => setLineId(e.target.value)} required>
          <option value="">-- Tanlang --</option>
          {lines.map(line => (
            <option key={line.id} value={line.id}>{line.name_uz || line.name}</option>
          ))}
        </select>

        <label>Sxema rasmi (ixtiyoriy):</label>
        <input type="file" onChange={e => setSchemaImage(e.target.files[0])} />

        <button type="submit" className="form-button" disabled={isSubmitting}>
          {isSubmitting ? 'Yuborilmoqda...' : '✅ Saqlash'}
        </button>

        {message.text && (
          <p style={{ color: message.type === 'error' ? 'red' : 'green', marginTop: '10px' }}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

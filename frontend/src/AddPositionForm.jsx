import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';
import './App.css';

export default function AddPositionForm() {
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [stationId, setStationId] = useState('');
  const [numberUz, setNumberUz] = useState('');
  const [numberRu, setNumberRu] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('lines/')
      .then(res => setLines(res.data))
      .catch(err => console.error('Liniyalarni olishda xatolik:', err));

    axios.get('stations/')
      .then(res => setStations(res.data))
      .catch(err => console.error('Bekatlarni olishda xatolik:', err));
  }, []);

  useEffect(() => {
    if (selectedLine) {
      setFilteredStations(stations.filter(st => st.line === parseInt(selectedLine)));
    } else {
      setFilteredStations([]);
    }
  }, [selectedLine, stations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stationId || !numberUz || !numberRu) {
      setError("Barcha maydonlarni to‘ldiring!");
      setSuccess(false);
      return;
    }

    try {
      await axios.post('positions/', {
        station: stationId,
        number: numberUz,
        number_ru: numberRu
      });
      setSuccess(true);
      setError(null);
      setStationId('');
      setNumberUz('');
      setNumberRu('');
      setSelectedLine('');
    } catch (err) {
      console.error(err);
      setError("Joy qo‘shishda xatolik!");
      setSuccess(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Joy qo‘shish</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Liniya tanlang:</label>
        <select value={selectedLine} onChange={e => setSelectedLine(e.target.value)} required>
          <option value="">-- Liniya tanlang --</option>
          {lines.map(line => (
            <option key={line.id} value={line.id}>
              {line.name_uz}
            </option>
          ))}
        </select>

        <label>Bekat tanlang:</label>
        <select value={stationId} onChange={e => setStationId(e.target.value)} required>
          <option value="">-- Bekat tanlang --</option>
          {filteredStations.map(station => (
            <option key={station.id} value={station.id}>
              {station.name_uz}
            </option>
          ))}
        </select>

        <label>Joy raqami (UZ):</label>
        <input type="text" value={numberUz} onChange={e => setNumberUz(e.target.value)} required />

        
        <button type="submit" className="form-button">✅ Saqlash</button>
        {success && <p style={{ color: 'green' }}>Joy muvaffaqiyatli qo‘shildi!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

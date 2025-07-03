import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function StepForm() {
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('lines/').then(res => setLines(res.data));
  }, []);

  const handleLineChange = async (e) => {
    const lineId = e.target.value;
    setSelectedLine(lineId);
    const res = await axios.get(`stations/?line=${lineId}`);
    setStations(res.data);
  };

  const handleStationClick = (stationId) => {
    navigate(`/station/${stationId}`);
  };

  return (
    <div className="container">
      <h2 className="title">Liniya va Bekat Tanlang</h2>

      {/* Liniya tanlash + tugmalar */}
      <div className="form-group">
        <label style={{ marginBottom: '10px', display: 'block' }}>Liniyani tanlang:</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select onChange={handleLineChange} value={selectedLine}>
            <option value="">Tanlang...</option>
            {lines.map(line => (
              <option key={line.id} value={line.id}>{line.name_uz}</option>
            ))}
          </select>

          <button className="form-button" onClick={() => navigate('/add-line')}>
            ➕ Liniya qo‘shish
          </button>
          <button className="form-button" onClick={() => navigate('/add-station')}>
            ➕ Bekat qo‘shish
          </button>
          <button className="form-button" onClick={() => navigate('/add-position')}>
            ➕ Joy qo‘shish
          </button>
        </div>
      </div>

      {/* Bekatlar ro‘yxati */}
      {stations.length > 0 && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label style={{ marginBottom: '10px' }}>Bekatlarni tanlang:</label>
          <div className="card-list">
            {stations.map(station => (
              <div
                className="card"
                key={station.id}
                onClick={() => handleStationClick(station.id)}
                style={{ cursor: 'pointer' }}
              >
                <h3 className="card-title">{station.name_uz}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

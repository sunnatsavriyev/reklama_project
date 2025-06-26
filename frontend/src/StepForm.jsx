import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import { useNavigate } from 'react-router-dom';

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
      <select onChange={handleLineChange} value={selectedLine}>
        <option value="">Liniyani tanlang</option>
        {lines.map(line => (
          <option key={line.id} value={line.id}>{line.name_uz}</option>
        ))}
      </select>

      {stations.length > 0 && (
        <div className="card-list">
          {stations.map(station => (
            <div className="card" key={station.id} onClick={() => handleStationClick(station.id)}>
              <h3 className="card-title">{station.name_uz}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

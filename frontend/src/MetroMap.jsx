import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosInstance';
import './MetroMap.css';

export default function MetroMap() {
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const now = new Date().getTime();
  axios.get(`stations/?_=${now}`)  
    .then(res => {
      const withCoords = res.data.filter(s => s.x !== null && s.y !== null);
      console.log("API dan kelgan bekatlar:", res.data);
      console.log("Koordinatasi bor bekatlar:", withCoords);
      setStations(withCoords);
    });
}, []);

  return (
    <div className="map-container">
      <img src="/metro-schema.png" alt="Metro Sxemasi" className="metro-image" />
      {stations.map(station => (
        <button
          key={station.id}
          className="station-dot"
          style={{ left: `${station.x}%`, top: `${station.y}%` }}
          onClick={() => navigate(`/station/${station.id}`)}
          title={station.name_uz}
        >
          ●
        </button>
      ))}
    </div>
  );
}

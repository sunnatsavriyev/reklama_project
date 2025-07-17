import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosInstance';
import './App.css';

export default function StationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPositions, setShowPositions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationRes = await axios.get(`stations/${id}/`);
        setStation(stationRes.data);

        const posRes = await axios.get(`positions/?station=${id}`);
        setPositions(posRes.data);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (!station) return <p>Bekat topilmadi</p>;

  const advertisedPositions = positions.filter(p => p.advertisement);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <h2>{station.name_uz} bekati</h2>

      {/* === SXEMA VA TUGMA YONMA-YON === */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
        {/* Schema Image */}
        {station.schema_image && (
          <img
            src={station.schema_image}
            alt="Schema"
            style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '10px',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Joylarni ko‘rish tugmasi */}
        {advertisedPositions.length > 0 && (
          <div>
            <button
              className="form-button"
              onClick={() => setShowPositions(!showPositions)}
              style={{ marginBottom: '15px', width: '200px' }}
            >
              {showPositions ? "Joylarni yashirish" : "Joylarni ko‘rish"}
            </button>
          </div>
        )}
      </div>

      {/* === Reklamali joylar ro‘yxati === */}
      {showPositions && (
        <div className="position-buttons-container">
          {advertisedPositions.map(pos => (
            <button
              key={pos.id}
              className="position-button"
              onClick={() => navigate(`/joy/${pos.id}`)}
            >
              Joy #{pos.number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

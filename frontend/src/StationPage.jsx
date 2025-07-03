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
    const fetchStationAndPositions = async () => {
      try {
        const stationRes = await axios.get(`stations/${id}/`);
        setStation(stationRes.data);

        const posRes = await axios.get(`positions/?station=${id}`);
        setPositions(posRes.data);
      } catch (error) {
        console.error('Xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationAndPositions();
  }, [id]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (!station) return <p>Bekat topilmadi</p>;

  const advertisedPositions = positions.filter(pos => pos.advertisement);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* === STANSIYA NOMI + 3ta TUGMA BIRGA === */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="title" style={{ margin: 0 }}>{station.name_uz} bekati</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
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

      {/* === SXEMA RASMI === */}
      {station.schema_image && (
        <img
          src={station.schema_image}
          alt="Sxema"
          style={{
            maxWidth: '600px',
            maxHeight: '400px',
            width: '100%',
            objectFit: 'contain',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            marginTop: '20px',
          }}
        />
      )}

      {/* === JOYLAR VA REKLAMA RO‘YXATI === */}
      <div style={{ flex: 1 }}>
        <h3>Reklamali joylar</h3>

        {advertisedPositions.length === 0 ? (
          <p>Reklamali joy mavjud emas</p>
        ) : (
          <div>
            <button
              className="form-button"
              onClick={() => setShowPositions(!showPositions)}
              style={{ marginBottom: '15px', width: '100%' }}
            >
              {showPositions ? 'Joylarni yashirish' : 'Joylarni ko‘rish'}
            </button>

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
        )}
      </div>
    </div>
  );
}

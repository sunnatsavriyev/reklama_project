import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosInstance';

export default function StationPage() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Faqat reklamasi bor joylar
  const advertisedPositions = positions.filter(pos => pos.advertisement);

  return (
    <div className="container" style={{ display: 'flex', gap: '40px' }}>
      {/* Sxema rasmi chapda */}
      <div style={{ flex: '1' }}>
        <h2 className="title">{station.name_uz} bekati</h2>
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
            }}
          />
        )}
      </div>

      {/* Reklama ma'lumotlari o‘ng tomonda */}
      <div style={{ flex: '1' }}>
        <h3>Reklamali joylar</h3>
        {advertisedPositions.length === 0 ? (
          <p>Reklamali joy mavjud emas</p>
        ) : (
          advertisedPositions.map(pos => {
            const ad = pos.advertisement;
            return (
              <div
                key={pos.id}
                className="card"
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                {ad.photo && (
                  <img
                    src={ad.photo}
                    alt="Reklama rasmi"
                    style={{
                      maxWidth: '150px',
                      maxHeight: '100px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      marginBottom: '10px',
                    }}
                  />
                )}

                <h4>{ad.Reklama_nomi_uz}</h4>
                <p><strong>Joy raqami:</strong> {pos.number}</p>
                <p><strong>Shartnoma raqami:</strong> {ad.Shartnoma_raqami_uz}</p>
                <p><strong>Muddati:</strong> {ad.Shartnoma_muddati_boshlanishi} — {ad.Shartnoma_tugashi}</p>
                <p><strong>Narxi:</strong> {ad.Qurilma_narxi} so‘m</p>
                <p><strong>Maydon:</strong> {ad.Egallagan_maydon} m²</p>
                <p><strong>Ijarachi:</strong> {ad.Ijarachi_uz}</p>
                <p><strong>Qurilma turi:</strong> {ad.Qurilma_turi_uz}</p>
                <p><strong>Aloqa:</strong> {ad.contact_number}</p>
                <p><strong>O‘lchov birligi:</strong> {ad.O_lchov_birligi_uz}</p>
                {ad.Shartnoma_fayl && (
                  <p>
                    <a href={ad.Shartnoma_fayl} target="_blank" rel="noopener noreferrer">
                      📄 Shartnoma faylini ko‘rish
                    </a>
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

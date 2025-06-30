import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from './axiosInstance';
import './App.css';

export default function JoyDetail() {
  const { id } = useParams();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const res = await axios.get(`positions/${id}/`);
        setPosition(res.data);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosition();
  }, [id]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (!position || !position.advertisement) return <p>Reklama topilmadi</p>;

  const ad = position.advertisement;

  return (
    <div className="container">
        <Link to={-1}>
            <button className="back-button">⬅ Orqaga</button>
        </Link>
      <h2 className="title">Joy #{position.number} — Reklama tafsilotlari</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {ad.photo_list && ad.photo_list.length > 0 ? (
          ad.photo_list.map((photoUrl, index) => (
            <img
              key={index}
              src={photoUrl}
              alt={`Reklama rasm ${index + 1}`}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            />
          ))
        ) : ad.photo ? (
          <img
            src={ad.photo}
            alt="Reklama rasm"
            style={{
              width: '100%',
              maxWidth: '250px',
              height: '160px',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          />
        ) : (
          <p>Rasm mavjud emas</p>
        )}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <p><strong>Reklama nomi:</strong> {ad.Reklama_nomi_uz}</p>
        <p><strong>Shartnoma raqami:</strong> {ad.Shartnoma_raqami_uz}</p>
        <p><strong>Ijarachi:</strong> {ad.Ijarachi_uz}</p>
        <p><strong>Muddati:</strong> {ad.Shartnoma_muddati_boshlanishi} — {ad.Shartnoma_tugashi}</p>
        <p><strong>Narxi:</strong> {ad.Qurilma_narxi} so‘m</p>
        <p><strong>Maydon:</strong> {ad.Egallagan_maydon} m²</p>
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
    </div>
  );
}

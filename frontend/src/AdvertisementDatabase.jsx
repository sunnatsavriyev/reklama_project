import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import './App.css';
import { useNavigate } from 'react-router-dom'; 

export default function AdvertisementDatabase() {
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('advertisements/')
      .then(res => setAds(res.data))
      .catch(err => console.error('Ma\'lumotlar bazasini olishda xatolik:', err));
  }, []);

  const filteredAds = ads.filter(ad =>
    ad.Reklama_nomi_uz?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.Shartnoma_raqami_uz?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="title">Ma’lumotlar Bazasi</h2>

      <button
        onClick={() => navigate('/add-ad')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        ➕ Reklama qo‘shish
      </button>

      <input
        className="form-input"
        type="text"
        placeholder="Reklama nomi yoki Shartnoma raqami..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', width: '100%', padding: '10px' }}
      />

      <div className="card-list">
        {filteredAds.length === 0 ? (
          <p>Hech qanday reklama topilmadi.</p>
        ) : (
          filteredAds.map(ad => (
            <div
              className="card"
              key={ad.id}
              onClick={() => navigate(`/edit-ad/${ad.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {ad.photo && (
                <img
                  src={ad.photo}
                  alt="Reklama rasmi"
                  className="card-img"
                />
              )}

              <div className="card-body">
                <h3 className="card-title">{ad.Reklama_nomi_uz}</h3>
                <p className="card-sub"><b>Shartnoma raqami:</b> {ad.Shartnoma_raqami_uz}</p>
                <p className="card-sub"><b>Shartnoma muddati:</b> {ad.Shartnoma_muddati_boshlanishi} — {ad.Shartnoma_tugashi}</p>
                <p className="card-sub"><b>Narx:</b> {ad.Qurilma_narxi} so‘m</p>
                <p className="card-sub"><b>Maydon:</b> {ad.Egallagan_maydon} m²</p>
                <p className="card-sub"><b>Ijarachi:</b> {ad.Ijarachi_uz}</p>
                <p className="card-sub"><b>Shartnoma summasi:</b> {ad.Shartnoma_summasi} so‘m</p>
                <p className="card-sub"><b>O‘lchov birligi:</b> {ad.O_lchov_birligi_uz}</p>
                <p className="card-sub"><b>Qurilma turi:</b> {ad.Qurilma_turi_uz}</p>
                <p className="card-sub"><b>Aloqa raqami:</b> {ad.contact_number}</p>

                {ad.Shartnoma_fayl && (
                  <p className="card-sub">
                    <a href={ad.Shartnoma_fayl} target="_blank" rel="noopener noreferrer">
                      📄 Shartnoma faylini ko‘rish
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

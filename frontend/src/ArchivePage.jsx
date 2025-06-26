// src/ArchivePage.jsx
import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import './App.css';

export default function ArchivePage() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get('advertisements-archive/')
      .then(res => setAds(res.data))
      .catch(err => console.error('Arxivni olishda xatolik:', err));
  }, []);

  return (
    <div>
      <h2 className="title">Arxivlangan Reklamalar</h2>
      <div className="card-list">
        {ads.length === 0 ? (
          <p>Arxivda hech qanday reklama topilmadi.</p>
        ) : (
          ads.map(ad => (
            <div className="card" key={ad.id}>
              {ad.photo && <img src={ad.photo} alt="reklama" className="card-img" />}
              <div className="card-body">
                <h3 className="card-title">{ad.Reklama_nomi_uz}</h3>
                <p className="card-sub">Ijarachi: {ad.Ijarachi_uz}</p>
                <p className="card-sub">Shartnoma raqami: {ad.Shartnoma_raqami_uz}</p>
                <p className="card-sub">{ad.Shartnoma_muddati_boshlanishi} — {ad.Shartnoma_tugashi}</p>
                <p className="card-sub">Narxi: {ad.Qurilma_narxi} so‘m</p>
                <p className="card-sub">Maydon: {ad.Egallagan_maydon} m²</p>
                <p className="card-sub">Summasi: {ad.Shartnoma_summasi} so‘m</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

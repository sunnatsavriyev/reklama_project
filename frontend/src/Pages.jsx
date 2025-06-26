import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import './App.css';

const API = 'http://localhost:8020/api';

const fetchData = async (endpoint, setter) => {
  try {
    const res = await axios.get(`${API}/${endpoint}/`);
    setter(res.data);
  } catch (err) {
    console.error(err);
  }
};

export function MetroLinesPage() {
  const [lines, setLines] = useState([]);
  useEffect(() => { fetchData('lines', setLines); }, []);

  return (
    <div className="container">
      <h2 className="title">Metro Yo‘nalishlari</h2>
      <div className="card-list">
        {lines.map(line => (
          <div className="card" key={line.id}>
            <div className="card-body">
              <h3 className="card-title">{line.name_uz}</h3>
              <p className="card-sub">Ruscha: {line.name_ru}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StationsPage() {
  const [stations, setStations] = useState([]);
  useEffect(() => { fetchData('stations', setStations); }, []);

  return (
    <div className="container">
      <h2 className="title">Bekatlar</h2>
      <div className="card-list">
        {stations.map(st => (
          <div className="card" key={st.id}>
            <div className="card-body">
              <h3 className="card-title">{st.name_uz}</h3>
              <p className="card-sub">Yo‘nalish: {st.line}</p>
              {st.schema_image && (
                <img src={st.schema_image} alt="sxema" className="card-img" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PositionsPage() {
  const [positions, setPositions] = useState([]);
  useEffect(() => { fetchData('positions', setPositions); }, []);

  return (
    <div className="container">
      <h2 className="title">Reklama Joylashuvlari</h2>
      <div className="card-list">
        {positions.map(pos => (
          <div className="card" key={pos.id}>
            <div className="card-body">
              <p className="card-title">{pos.station}</p>
              <p className="card-sub">Joy raqami: {pos.number}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArchivePage() {
  const [ads, setAds] = useState([]);
  useEffect(() => { fetchData('advertisements-archive', setAds); }, []);

  return (
    <div className="container">
      <h2 className="title">Reklama Arxivi</h2>
      <div className="card-list">
        {ads.map(ad => (
          <div className="card" key={ad.id}>
            {ad.photo && (
              <img src={ad.photo} alt="rasm" className="card-img" />
            )}
            <div className="card-body">
              <h3 className="card-title">{ad.Reklama_nomi_uz}</h3>
              <p className="card-sub">Ijarachi: {ad.Ijarachi_uz}</p>
              <p className="card-sub">Shartnoma: {ad.Shartnoma_raqami_uz}</p>
              <p className="card-sub">{ad.Shartnoma_muddati_boshlanishi} — {ad.Shartnoma_tugashi}</p>
              <p className="card-sub">Narxi: {ad.Qurilma_narxi} so'm</p>
              <p className="card-sub">Maydon: {ad.Egallagan_maydon} m²</p>
              <p className="card-sub">Summasi: {ad.Shartnoma_summasi} so'm</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
